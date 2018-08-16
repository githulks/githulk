'use strict';
describe('githulk.search', function () {
  var hulk = require('./hulk')
    , assume = hulk.assume
    , githulk = hulk.hulk;

  this.timeout(30000);

  describe('query', function() {
    it('processes queries', function (next) {
      githulk.search.query('code', { 
        query: 'assume repo:githulks/githulk filename:package.json'
      }, function (err, results) {
          if (err) return next(err);

          assume(results).is.a('array');
          assume(results[0].items).is.a('array');
          assume(results[0].total_count).equals(1);

          next();
        }
      );
    });
  });
});
