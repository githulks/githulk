'use strict';

var debug = require('debug')('githulk')
  , mana = require('mana');

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
   * parse github information out of given string.
   *
   * @param {String} info The project information.
   * @returns {Object}
   * @api public
   */
  project: function project(info) {
    info = info.split('/');

    return {
      user: info[0] || this.user,
      repo: info[1]
    };
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
