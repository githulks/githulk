'use strict';

var debug = require('diagnostics')('githulk:collaborators');

/**
 * Collaborators API endpoint.
 *
 * @constructor
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Collaborators(api) {
  this.send = api.send.bind(api);
  this.options = api.options;
  this.api = api;
}

/**
 * Get collaborator information for a username/repo.
 *
 * @param {String} project The project details.
 * @param {Object} options Optional options.
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Collaborators.prototype.get = function get(args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options);

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'collaborators'],
    args.options,
    args.fn
  );
};

/**
 * Add a collaborator to the owner/repo given
 *
 * @param {String} project
 * @param {Object} Options with username/user.
 * @returns {Collaborator}
 * @api public
 */
Collaborators.prototype.add = function add(args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options);

  var user = args.options.username || args.options.user;

  if (!user) return args.fn(new Error('User is a required options'));

  var project = this.api(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'collaborators', user],
    args.options,
    args.fn
  );
};

//
// Expose the Collaborators API.
//
module.exports = Collaborators;
