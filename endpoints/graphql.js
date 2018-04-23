'use strict';

var debug = require('diagnostics')('githulk:graphql');

/**
 * GraphQL API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function GraphQL(api) {
  this.send = api.send.bind(api);
  this.api = api;
}

/**
 * Dispatch a GraphQL query
 *
 * @param {String} query The query
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
GraphQL.prototype.get = function get(args) {
  args = this.api.args(arguments);
  args.options = args.options || {};

  args.options.method = 'POST';
  args.options.params = { query: args.options.query || '' };

  return this.send(['graphql'], this.api.options(args.options), args.fn);
};

//
// Expose the GraphQL API.
//
module.exports = GraphQL;
