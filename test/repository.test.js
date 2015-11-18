describe('githulk.repository', function () {
  'use strict';

  var hulk = require('./hulk')
    , assume = hulk.assume
    , githulk = hulk.hulk
    , edit;

  this.timeout(30000);

  describe('.branches', function () {
    it('lists all branches', function (next) {
      githulk.repository.branches('twbs/bootstrap', function (err, branches) {
        if (err) return next(err);

        assume(branches).is.a('array');
        branches.forEach(function (branch) {
          assume(branch.name).to.be.a('string');
          assume(branch.commit).to.be.an('object');
        });

        next();
      });
    });
  });
});
