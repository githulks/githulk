'use strict';

/**
 * Labels API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Labels(api) {
  this.send = api.send.bind(api);
  this.qs = api.querystringify;
  this.api = api;
}

/**
 * Get all labels for the given project.
 *
 * @param {String} project The User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Labels.prototype.list = function list(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'labels'],
    options,
    args.fn
  );
};

/**
 * Get a single label.
 *
 * @param {String} project The User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Labels.prototype.get = function get(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'labels', options.label],
    options,
    args.fn
  );
};

/**
 * Create a new label.
 *
 * @param {String} project The User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Labels.prototype.create = function create(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'labels', this.qs(options, [
      'name',       // Name of the label.
      'color'       // Color of the label.
    ])],
    this.api.merge(options, {
      method: 'POST'
    }),
    args.fn
  );
};

/**
 * Remove a label.
 *
 * @param {String} project The User/repo combination.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @api public
 */
Labels.prototype.remove = function remove(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  return this.send(
    ['repos', project.user, project.repo, 'labels', options.label],
    this.api.merge(options, {
      method: 'PATCH'
    }),
    args.fn
  );
};

//
// Expose the labels API.
//
module.exports = Labels;
