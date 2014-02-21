'use strict';

function Repository(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * Get the README contents of an project.
 *
 * @param {String} project The project details.
 * @param {Object} options Optional options.
 * @param {function} fn The callback
 * @returns {Assign}
 * @api public
 */
Repository.prototype.readme = function readme(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.headers = options.headers || {};
  options.headers.Accept = this.api.accepts(options.headers.Accept || 'html');

  return this.send(
    ['repos', project.user, project.repo, 'readme'],
    options,
    args.fn
  );
};

/**
 * Retrieve the raw contents of a file from the repository.
 *
 * @param {String} project The project details.
 * @param {Object} options Optional options.
 * @param {Function} fn The Callback.
 * @api private
 */
Repository.prototype.raw = function raw(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.headers = options.headers || {};
  options.headers.Accept = options.headers.Accept || 'text/plain';
  options.branch = options.branch || 'master';
  options.api = 'https://raw.github.com/';

  return this.send(
    [project.user, project.repo, options.branch, options.path],
    options,
    args.fn
  );
};

/**
 * Retrieve the contents of a file or directory.
 *
 * @param {String} project The project details.
 * @param {Object} options Optional options.
 */
Repository.prototype.content = function contents(args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str)
    , options = args.options || {};

  options.headers = options.headers || {};
  options.headers.Accept = options.headers.Accept || 'text/plain';
  options.path = 'contents/'+ (options.path || '');

  return this.send(
    ['repo', project.user, project.repo, options.path],
    options,
    args.fn
  );
};

//
// Expose the repository API
//
module.exports = Repository;
