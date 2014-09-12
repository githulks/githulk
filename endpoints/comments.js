'use strict';

var debug = require('diagnostics')('githulk:comments');

/**
 * Issues API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Comments(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * List all comments of an issue.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The issue number.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Comments.prototype.list = function list(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number, 'comments'],
    options,
    args.fn
  );
};

/**
 * Get all issues for the given repository.
 *
 * @param {String} project User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Comments.prototype.repository = function repository(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.params = [
    'direction',
    'since',
    'sort'
  ];

  return this.send(
    ['repos', project.user, project.repo, 'issues', 'comments'],
    options,
    args.fn
  );
};


/**
 * Get a single comment
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The comment id.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Comments.prototype.get = function get(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues', 'comments', args.number],
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
Comments.prototype.create = function create(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.params = ['body'];

  return this.send(
    ['repos', project.user, project.repo, 'issues', args.number, 'comments'],
    this.api.merge(options, { method: 'POST' }),
    args.fn
  );
};

/**
 * Edit a single issue.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The comment id.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Comments.prototype.edit = function create(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.params = ['body'];

  return this.send(
    ['repos', project.user, project.repo, 'issues', 'comments', args.number],
    this.api.merge(options, { method: 'PATCH' }),
    args.fn
  );
};

/**
 * Remove a single issue.
 *
 * @param {String} project User/repo combination.
 * @param {Number} number The comment id.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Comments.prototype.edit = function create(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'issues', 'comments', args.number],
    this.api.merge(options, { method: 'DELETE' }),
    args.fn
  );
};

//
// Expose the comments API.
//
module.exports = Comments;
