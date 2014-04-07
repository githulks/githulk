'use strict';

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
 * Get all issues (repos, orgs etc), for the authenticated user.
 *
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Issues.prototype.get = function get(args) {
  args = this.api.args(arguments);

  return this.send(
    ['issues'],
    args.options || {},
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

  return this.send(
    ['user', 'issues'],
    args.options || {},
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

  return this.send(
    ['orgs', args.string, 'issues'],
    args.options || {},
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

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'issues'],
    args.options || {},
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

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number],
    args.options || {},
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

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number],
    this.api.merge(args.options || {}, {
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

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number],
    this.api.merge(args.options || {}, {
      method: 'PATCH'
    }),
    args.fn
  );
};

//
// Expose the issues API.
//
