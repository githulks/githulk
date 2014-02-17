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

  return this.send(['repos', project.user, project.repo, 'readme'], options, args.fn);
};

//
// Expose the repository API
//
module.exports = Repository;
