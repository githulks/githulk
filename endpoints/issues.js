'use strict';

/**
 * Issues API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Issues(api) {
  this.send = api.send.bind(api);
  this.qs = api.querystringify;
  this.api = api;
}

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
  options.params = [
    'filter',     // Filter issues.
    'state',      // Issue state.
    'lables',     // Contains these labels.
    'sort',       // Sort on.
    'direction',  // Sort direction
    'since'       // Issues created since
  ];

  return this.send(
    ['issues'],
    options,
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
    ['user', 'issues', this.qs(options, [
      'filter',     // Filter issues.
      'state',      // Issue state.
      'lables',     // Contains these labels.
      'sort',       // Sort on.
      'direction',  // Sort direction
      'since'       // Issues created since
    ])],
    options,
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
    ['orgs', args.string, 'issues', this.qs(options, [
      'filter',     // Filter issues.
      'state',      // Issue state.
      'lables',     // Contains these labels.
      'sort',       // Sort on.
      'direction',  // Sort direction.
      'since'       // Issues created since.
    ])],
    options,
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
    ['repos', project.user, project.repo, 'issues', this.qs(options, [
      'milestone',  // List issues for milestone>
      'state',      // Issue state.
      'assignee',   // Assigned to which user.
      'creator',    // Created by which user.
      'mentioned',  // Mentions user.
      'lables',     // Has labels
      'sort',       // Sort on.
      'direction',  // Sort direction.
      'since'       // Issues created since.
    ])],
    options,
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
Issues.prototype.issue = function issue(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number],
    options,
    args.fn
  );
};

/**
 * Create a new issue.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The issue number.
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
    ['repos', project.user, project.repo, 'issues', args.number, this.qs(options, [
      'title',      // Required: Title of the issue.
      'body',       // Issue content.
      'assignee',   // Assigned user.
      'milestone',  // Milestone assigned.
      'labels'      // Labels to add.
    ])],
    this.api.merge(options, {
      method: 'POST'
    }),
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
    ['repos', project.user, project.repo, 'issues', args.number, this.qs(options, [
      'title',      // Title of the issue.
      'body',       // Issue content.
      'assignee',   // Assigned user.
      'milestone',  // Milestone assigned.
      'labels'      // Labels to add.
    ])],
    this.api.merge(options, {
      method: 'PATCH'
    }),
    args.fn
  );
};

//
// Expose the issues API.
//
module.exports = Issues;
