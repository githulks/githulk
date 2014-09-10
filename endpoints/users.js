'use strict';

var debug = require('diagnostics')('githulk:user');

/**
 * User API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function User(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * Get user information for a given username.
 *
 * @param {String} project The project details.
 * @param {Object} options Optional options.
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
User.prototype.get = function get(args) {
  args = this.api.args(arguments);

  if (!args.str) return this.send(
    ['user'],
    args.options || {},
    args.fn
  );

  var project = this.api.project(args.str) || {};

  return this.send(
    ['users', project.user || args.str],
    args.options || {},
    args.fn
  );
};

/**
 * Get organization information for a given username.
 *
 * @param {String} project The project details.
 * @param {Object} options Optional options.
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
User.prototype.orgs = function get(args) {
  args = this.api.args(arguments);

  if (!args.str) return this.send(
    ['user', 'orgs'],
    args.options || {},
    args.fn
  );

  var project = this.api.project(args.str) || {};

  return this.send(
    ['users', project.user || args.str, 'orgs'],
    args.options || {},
    args.fn
  );
};

//
// Expose the User API.
//
module.exports = User;
