'use strict';

describe('githulk.graphql', function () {
  var hulk = require('./hulk')
    , assume = hulk.assume
    , githulk = hulk.hulk;

  this.timeout(30000);

  describe('queries', function() {
    it('processes queries', function (next) {
      githulk.graphql.get({ 
        query: `
          {
            repository(owner:"githulks", name:"githulk") {  
              packagejson: object(expression: "master:package.json") {
                ... on Blob {
                  text
                }
              }
              commit: object(expression: "HEAD") {
                ... on Commit {
                  HEAD: abbreviatedOid
                }
              }
            }
            rateLimit {
              limit
              cost
              remaining
              resetAt
            }
          }`
        },
        function (err, results) {
          if (err) return next(err);

          var data = results.data;

          var packageJson = require('../package.json');

          assume(JSON.parse(data.repository.packagejson.text).name).equals(packageJson.name);
          assume(JSON.parse(data.repository.packagejson.text).description).equals(packageJson.description);

          assume(data.repository.commit).hasOwn('HEAD');

          assume(data.rateLimit).hasOwn('limit');
          assume(data.rateLimit).hasOwn('cost');
          assume(data.rateLimit).hasOwn('remaining');
          assume(data.rateLimit).hasOwn('resetAt');

          next();
        }
      );
    });
  });
});
