describe('githulk.assignees', function () {
  'use strict';

  var hulk = require('./hulk')
    , assume = hulk.assume
    , githulk = hulk.hulk;

  this.timeout(30000);

  describe('.list', function () {
    it('returns a list of owners + collab', function (next) {
      githulk.assignees.list(hulk.repo, function listed(err, list) {
        if (err) return next(err);

        assume(list).to.be.a('array');
        assume(list.some(function some(collab) {
          return collab.login === hulk.owner;
        })).to.be.true();

        next();
      });
    });
  });

  describe('.assignee', function () {
    it('confirms that the supplied user can be assigned', function (next) {
      githulk.assignees.assignee(hulk.repo, {
        assignee: hulk.owner
      }, next);
    });

    it('confirms that the supplied user CANNOT be assigned', function (next) {
      githulk.assignees.assignee(hulk.repo, {
        assignee: hulk.owner + Math.random().toString().split('').map(function (n) {
          return String.fromCharCode(97 + (+n || 1));
        }).join('')
      }, function (err) {
        if (err) return next();
        next(new Error('I should receive an ERRORORR'));
      });
    });
  });
});
