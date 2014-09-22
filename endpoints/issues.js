'use strict';

var debug = require('diagnostics')('githulk:issues');

/**
 * Issues API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Issues(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * All the available options for listing issues.
 *
 * @type {Array}
 * @private
 */
Issues.params = [
  'assignee',   // Assigned to which user.
  'creator',    // Created by which user.
  'direction',  // Sort direction.
  'filter',     // Filter issues.
  'lables',     // Contains these labels.
  'mentioned',  // Mentions user.
  'milestone',  // List issues for milestone>
  'since',      // Issues created since.
  'sort',       // Sort on.
  'state'       // Issue state.
];

/**
 * All the available options for creating and modifying an issue.
 *
 * @type {Array}
 * @private
 */
Issues.create = [
  'assignee',   // Login for the user that this issue should be assigned to.
  'body',       // The contents of the issue.
  'labels',     // Labels to associate with this issue.
  'milestone',  // Milestone to associate this issue with.
  'state',      // Issue state.
  'title'       // The title of the issue.
];

/**
 * Get all issues (repos, orgs etc), for the authenticated user.
 *
 * @param {Object} options Optional options.
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.list = function list(args) {
  args = this.api.args(arguments);

  var options = args.options || {};

  return this.send(
    ['issues'],
    this.api.options(options, Issues.params),
    args.fn
  );
};

/**
 * List all issues for a given user name.
 *
 * @param {String} org The user name.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.user = function user(args) {
  args = this.api.args(arguments);

  var options = args.options || {};

  return this.send(
    ['user', 'issues'],
    this.api.options(options, Issues.params),
    args.fn
  );
};

/**
 * List all issues for a given organization.
 *
 * @param {String} org The organization
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.organization = function organization(args) {
  args = this.api.args(arguments);

  var options = args.options || {};

  return this.send(
    ['orgs', args.string, 'issues'],
    this.api.options(options, Issues.params),
    args.fn
  );
};

/**
 * List all issues for a given repository.
 *
 * @param {String} org The organization
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.repository = function repository(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues'],
    this.api.options(options, Issues.params),
    args.fn
  );
};

/**
 * Get a single issue.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The issue number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.get = function get(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number],
    this.api.options(options),
    args.fn
  );
};

/**
 * Create a new issue.
 *
 * @param {String} project User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.create = function create(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues'],
    this.api.options(this.api.merge(options, { method: 'POST' }), Issues.create),
    args.fn
  );
};

/**
 * Edit a single issue.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The issue number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Issues.prototype.edit = function edit(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number],
    this.api.options(this.api.merge(options, { method: 'PATCH' }), Issues.create),
    args.fn
  );
};

//
// Expose the issues API.
//
module.exports = Issues;
