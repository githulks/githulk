'use strict';

var debug = require('debug')('githulk')
  , mana = require('mana');

/**
 * GitHulk smash API.
 *
 * @constructor
 * @api public
 */
mana.extend({
  initialise: function initalise(options) {
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
    // No user / password, no predefined authorization, so maybe we've received
    // an OAuth token.
    //
    var token = options.token || process.env.GITHUB_TOKEN || process.env.GITHULK_TOKEN;

    if (!this.authorization && token) {
      if ('string' === typeof this.tokens) this.tokens = this.tokens.split(',');
      this.tokens.unshift(token);
    }

    //
    // We want to use a cache engine for the optimizing our responses. This
    // makes us use conditional requests for the Github API making it easier to
    // stay within your API rate limit.
    //
    if (options.cache) this.cache = options.cache;
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
  }
}).drink(module);
