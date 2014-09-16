'use strict';

var debug = require('diagnostics')('githulk:pullrequest');

/**
 * Pull Request API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Pulls(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * All the available options for listing pull requests.
 *
 * @type {Array}
 * @private
 */
Pulls.params = [
  'base',       // Filter pulls by base branch name.
  'direction',  // The direction of the sort. Can be either asc or desc.
  'head',       // Filter pulls by head user and branch name.
  'sort',       // What to sort results by.
  'state'       // Either open, closed, or all to filter by state.
];

/**
 * All available options for creating a new pull request.
 *
 * @type {Array}
 * @private
 */
Pulls.create = [
  'base',       // The name of the branch you want your changes pulled into.
  'body',       // The contents of the pull request.
  'head',       // The name of the branch where your changes are implemented.
  'issue',      // The issue number in this repository to turn into a Pull Request.
  'state',      // Either open, closed.
  'title'       // The title of the pull request.
];

/**
 * List pull requests.
 *
 * @param {Object} options Optional options.
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.list = function list(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.params = Pulls.params;

  return this.send(
    ['repos', project.user, project.repo, 'pulls'],
    options,
    args.fn
  );
};

/**
 * Get a single pull request
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The pull request number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.get = function get(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'pulls', args.number],
    options,
    args.fn
  );
};

/**
 * Create a new pull request.
 *
 * @param {String} project User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.create = function create(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.params = Pulls.create;

  return this.send(
    ['repos', project.user, project.repo, 'pulls'],
    this.api.merge(options, { method: 'POST' }),
    args.fn
  );
};

/**
 * Edit a single pull request.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The pull request number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.edit = function edit(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.params = Pulls.create;

  return this.send(
    ['repos', project.user, project.repo, 'pulls', args.number],
    this.api.merge(options, { method: 'PATCH' }),
    args.fn
  );
};

/**
 * List all commits on the pull request.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The pull request number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.commits = function commits(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'pulls', args.number, 'commits'],
    options,
    args.fn
  );
};

/**
 * List all files on the pull request.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The pull request number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.files = function files(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'pulls', args.number, 'files'],
    options,
    args.fn
  );
};

/**
 * Check if the pull request has been merged.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The pull request number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.merged = function merge(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'pulls', args.number, 'merge'],
    options,
    args.fn
  );
};

/**
 * Merge the given pull request.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The pull request number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Pulls.prototype.merge = function merge(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'pulls', args.number, 'merge'],
    this.api.merge(options, { method: 'PUT' }),
    args.fn
  );
};

//
// Expose the issues API.
//
module.exports = Pulls;
