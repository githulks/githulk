'use strict';

/**
 * List available assignees.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Assignees(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * Get a list of users that can get assigned.
 *
 * @param {String} project User/repo combination.
 * @param {Options} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Assignees.prototype.list = function list(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'assignees'],
    options,
    args.fn
  );
};

/**
 * Check if a given assignee is allowed for the repository.
 *
 * @param {String} project User/repo combination.
 * @param {Options} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Assignees.prototype.assignee = function assignee(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, options.assignee],
    options,
    args.fn
  );
};

//
// Expose the assignees API.
//
module.exports = Assignees;
