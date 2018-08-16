'use strict';

/**
 * Search
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Search(api) {
  this.qs = api.querystring.bind(api);
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * Search github
 *
 * @param {String} type The resource type to search for (repositories, commits, code, issues, users, topics, or labels)
 * @param {Object} options Request options
 * @param {String} options.query The query
 * @param {function} fn The callback.
 * @api public
 */
Search.prototype.query = function query(args) {
  args = this.api.args(arguments);

  var type = args.str
    , options = args.options || {};

  return this.send(
    ['search', type],
    this.api.options(options, { q: options.query }),
    args.fn
  );
};

//
// Expose the search API.
//
module.exports = Search;
