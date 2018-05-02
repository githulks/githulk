'use strict';

var debug = require('diagnostics')('githulk:graphql');

/**
 * GraphQL API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function GraphQL(api) {
  this.send = api.manaql.send.bind(api.manaql);
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
GraphQL.prototype.sendQuery = function sendQuery(args) { 
  args = this.api.args(arguments);
  args.options = args.options || {};

  var query = args.options.query || '{ \n }'; 
 
  if(!~query.indexOf('rateLimit')) { 
    var queryEnd = query.lastIndexOf('}'); 
    var rateLimitFrag = '\n fragment rateLimit on Query { rateLimit { limit cost remaining resetAt } }'; 
 
    query = query.slice(0, queryEnd) + '  ...rateLimit \n' + query.slice(queryEnd); 
    query += rateLimitFrag; 
  }

  args.options.method = 'POST';
  args.options.params = args.options.params || {}; 
  args.options.params.query = query;
  args.options.query = query;

  return this.send(
    ['graphql'], 
    args.options, 
    function handler(err, results) {
      if (err) return args.fn(err);

      args.fn(null, results.length ? results[0] : null);
  });
};

//
// Expose the GraphQL API.
//
module.exports = GraphQL;
