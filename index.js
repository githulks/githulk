'use strict';

var debug = require('diagnostics')('githulk')
  , mana = require('mana')
  , url = require('url');

/**
 * GitHulk smash API.
 *
 * Options:
 * - url: The location of the API.
 * - maxdelay: Maximum delay for exponential back off.
 * - mindelay: Minimum delay for exponential back off.
 * - retries: The amount of retries we should before failing.
 * - factor: Exponential back off factor.
 * - cache: We need to use to store requests in so we can handle 304's and not
 *   eat the API tokens.
 * - tokens: Array of tokens we should use for these requests.
 * - token: Single token we should use to connect. I added to the tokens array.
 * - user: Username of your GitHub account (if you don't want to use tokens)
 * - password: Password of your GitHub account (if you don't want to use tokens)
 * - authorization: Custom authorization we should be using instead of tokens.
 *
 * @constructor
 * @param {Object} options GitHulk configuration
 * @api public
 */
mana.extend({
  initialise: function initialise(options) {
    options = options || {};

    options.url = 'url' in options ? options.url : 'https://api.github.com/';
    options.maxdelay = 'maxdelay' in options ? options.maxdelay : 60000;
    options.mindelay = 'mindelay' in options ? options.mindelay : 100;
    options.retries = 'retries' in options ? options.retries : 3;
    options.factor = 'factor' in options ? options.factor : 2;
    options.cache = 'cache' in options ? options.cache : null;
    options.tokens = 'tokens' in options ? options.tokens : [];

    this.authorization = options.authorization;
    this.mindelay = options.mindelay;
    this.maxdelay = options.maxdelay;
    this.mirrors = options.mirrors;
    this.retries = options.retries;
    this.factor = options.factor;
    this.tokens = options.tokens;
    this.user = options.user;
    this.api = options.url;

    //
    // Pre-compile the basic authorization so we can do updates and deletes
    // against the registries.
    //
    if (!this.authorization && options.user && options.password) {
      debug('received authorization information for %s', options.user);
      this.authorization = 'Basic '+ new Buffer(
        options.user +':'+ options.password
      ).toString('base64');
    }

    //
    // Transform tokens in an array, strings are here as they can be more
    // readable.
    //
    if ('string' === typeof this.tokens) {
      this.tokens = this.tokens.split(',');
    }

    //
    // No user / password, no predefined authorization, so maybe we've received
    // an OAuth token.
    //
    var token = options.token
      || process.env.GITHULK_TOKEN
      || process.env.GITHULK
      || process.env.GITHUB_TOKEN;

    if (!this.authorization && token) {
      this.tokens.push(token);
    }

    //
    // We want to use a cache engine for the optimizing our responses. This
    // makes us use conditional requests for the Github API making it easier to
    // stay within your API rate limit.
    //
    if (options.cache) {
      this.cache = options.cache;
    }
  },

  /**
   * Parse out github information from a given string or object. For the object
   * we assume that we're given an object with repository information as seen in
   * your package.json
   *
   * @param {String|Object} data The information that needs to be parsed.
   * @returns {Object}
   * @api public
   */
  project: require('extract-github'),

  /**
   * Return the correct Accept headers for a given content type.
   *
   * @param {String} type
   * @returns {String}
   */
  accepts: function accepts(type) {
    var types = {
      text: 'application/vnd.github.v3.text+json',
      html: 'application/vnd.github.v3.html+json',
      full: 'application/vnd.github.v3.full+json',
      raw: 'application/vnd.github.v3.raw+json'
    };

    return types[type] || types[type.toLowerCase()] || type;
  },

  /**
   * Helper function to create some sane default options that we supply to the
   * API.
   *
   * @param {Object} args Received optional options
   * @param {Array|Object} params Optional params.
   * @returns {Object} Args.
   * @api private
   */
  options: function options(args, params) {
    args = args || {};
    args.params = args.params || params || [];

    //
    // Add some default values.
    //
    var defaults = { page: 1, per_page: 100 };
    Object.keys(defaults).forEach(function each(key) {
      if (Array.isArray(args.params)) {
        if (!~args.params.indexOf(key)) args.params.push(key);
      } else {
        if (!(key in args.params)) args.params[key] = defaults[key];
      }
    });

    return args;
  },

  /**
   * Parse Github link headers.
   *
   * @param {String} header The link header we need to parse.
   * @returns {Object}
   * @api public
   */
  link: function link(header) {
    return header.split(',').reduce(function reduce(memo, part) {
      var chunks = /<([^<]+)?>\;\srel="([^"]+)?"/.exec(part.trim());

      if (!chunks) return memo;
      memo[chunks[2]] = url.parse(chunks[1], true);

      return memo;
    }, Object.create(null));
  },

  /**
   * We need to override the `send` method of mana so we can attempt to parse the
   * pagination headers of GitHub and follow if needed so this can all be
   * handled transparently.
   *
   * @returns {Assign} The assign instance that receives all the things
   * @api private
   */
  send: function send(args) {
    args = this.args(arguments);

    var options = JSON.parse(JSON.stringify(args.options))
      , hulk = this;

    /**
     * A simple optional callback.
     *
     * @param {Response} res Incoming HTTP response.
     * @param {Assign} assign The assign instance that got returned.
     * @param {Object} oargs The original args that got passed in to the request.
     * @api private
     */
    args.options.next = function next(res, assign, oargs) {
      oargs = oargs || args;

      //
      // When the `nofollow` option is provided we should not follow the
      // returned link headers from the GitHub API. It's something that users
      // want to manage them selfs.
      //
      if (!res.headers.link || oargs.options.nofollow) return assign.end();

      var link = hulk.link(res.headers.link);

      //
      // We've reached the end of the of the iteration, also bail out.
      //
      if (!link.next || !link.next.query) return assign.end();

      //
      // We've received instructions from GitHub that there are more pages with
      // information that we need to parse out. Continue to follow these link
      // headers to create a full set of data. We leverage the `oargs` (original
      // args) from the first request and only update the request params.
      //
      if (link.next.query.page) {
        options.page = link.next.query.page;
      }

      if (link.next.query.per_page) {
        options.per_page = link.next.query.per_page;
      }

      //
      // This will be the last batch of data we need to process, so we can
      // remove this next function and just make this thing process as normal
      // again.
      //
      if (!link.last || link.next.query.page === link.last.query.page) {
        delete oargs.options.next;
      }

      //
      // Merge the options, mana can delete options while it creates params for
      // the connection. We've stored a copy of them before, and we're going to
      // merge them over again.
      //
      hulk.merge(oargs.options, options);

      //
      // Remove oargs.str if we have an array preference.
      //
      if (oargs.str && oargs.array) oargs.str = '';
      oargs.options.assign = assign;

      // No need to enqueue another callback.
      return mana.prototype.send.call(hulk,
        oargs.array, oargs.nr, oargs.options, oargs.str
      );
    };

    return mana.prototype.send.call(hulk,
      args.array, args.fn, args.nr, args.options, args.str
    );
  }
}).drink(module);
