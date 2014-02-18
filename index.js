'use strict';

var debug = require('debug')('githulk')
  , mana = require('mana');

/**
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

    this.authorization = options.authorization;
    this.mindelay = options.mindelay;
    this.maxdelay = options.maxdelay;
    this.mirrors = options.mirrors;
    this.retries = options.retries;
    this.factor = options.factor;
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
  project: function project(data) {
    var http = /github.com[\/|:]([^\/]+)\/([^\/]+)[.git|\/]?$/gi
      , githubio = /https?:\/\/(.*)\.github\.io\/([^\/]+)\/?/gi
      , type = this.type(data)
      , result;

    //
    // Try to extract github user name + repository information from a given
    // github URL or a simple path structure.
    //
    if ('string' === type) {
      if (
           (result = http.exec(data))
        || (result = githubio.exec(data))
        || ((result = data.split('/')) && result.length === 2)
      ) {
        return { user: result[1], repo: result[2] };
      }
    } else if ('object' === type) {
      //
      // The structure already exists, assume a pre-parsed object.
      //
      if ('user' in data && 'repo' in data) return data;

      result = this.url(data.repository, 'github')
        || this.url(data.homepage, 'github')
        || this.url(data.issues, 'github')
        || this.url(data, 'github');

      if (result) return project(result);
    }

    return { user: this.user };
  },

  /**
   * Find an URL in a given data structure.
   *
   * @param {Object} data Data structure
   * @param {String} contains String to contain.
   * @returns {String}
   * @api private
   */
  url: function url(data, contains) {
    if (!data) return undefined;

    if ('string' === typeof data && ~data.indexOf(contains)) return data;
    if ('object' === typeof data && !Array.isArray(data)) {
      if ('url' in data) return url(data.url, contains);
      if ('web' in data) return url(data.web, contains);
    }

    return undefined;
  },

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
  }
}).drink(module);
