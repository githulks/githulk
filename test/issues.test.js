describe('githulk.issues', function () {
  'use strict';

  var hulk = require('./hulk')
    , assume = hulk.assume
    , githulk = hulk.hulk
    , edit;

  this.timeout(30000);

  describe('.list', function () {
    it('lists open all issues', function (next) {
      githulk.issues.list(function (err, list) {
        if (err) return next(err);

        assume(list).is.a('array');
        assume(list.every(function (issue) {
          return issue.state === 'open';
        })).is.true();

        next();
      });
    });

    it('lists closed all issues', function (next) {
      githulk.issues.list({ state: 'closed' }, function (err, list) {
        if (err) return next(err);

        assume(list).is.a('array');
        assume(list.every(function (issue) {
          return issue.state === 'closed';
        })).is.true();

        next();
      });
    });
  });

  describe('.user', function () {
    it('lists open all issues', function (next) {
      githulk.issues.user(function (err, list) {
        if (err) return next(err);

        assume(list).is.a('array');
        assume(list.every(function (issue) {
          return issue.state === 'open';
        })).is.true();

        next();
      });
    });

    it('lists closed all issues', function (next) {
      githulk.issues.user({ state: 'closed' }, function (err, list) {
        if (err) return next(err);

        assume(list).is.a('array');
        assume(list.every(function (issue) {
          return issue.state === 'closed';
        })).is.true();

        next();
      });
    });
  });

  describe('.repository', function () {
    it('lists open all issues', function (next) {
      githulk.issues.repository(hulk.repo, function (err, list) {
        if (err) return next(err);

        assume(list).is.a('array');
        assume(list.every(function (issue) {
          return issue.state === 'open';
        })).is.true();

        next();
      });
    });

    it('lists closed all issues', function (next) {
      githulk.issues.repository(hulk.repo, { state: 'closed' }, function (err, list) {
        if (err) return next(err);

        assume(list).is.a('array');
        assume(list.every(function (issue) {
          return issue.state === 'closed';
        })).is.true();

        next();
      });
    });
  });

  describe('.get', function () {
    it('gets the information for one single issue', function (next) {
      githulk.issues.get(hulk.repo, hulk.issues.open, function (err, data) {
        if (err) return next(err);
        var issue = data.pop();

        assume(issue.number).equals(hulk.issues.open);
        next();
      });
    });
  });

  describe('.create', function () {
    it('creates a new issue', function (next) {
      githulk.issues.create(hulk.repo, {
        title: 'Generated through API, please ignore',
        body: 'This issue has been generated through the `githulk` api',
        labels: ['used by test suite'],
        assignee: hulk.owner
      }, function (err, data) {
        if (err) return next(err);
        var issue = data.pop();

        edit = issue.number;
        assume(edit).is.a('number');

        githulk.issues.get(hulk.repo, edit, next);
      });
    });
  });

  describe('.edit', function () {
    it('can edit all the things', function (next) {
      githulk.issues.edit(hulk.repo, edit, {
        state: 'closed',
        title: 'Editted through the API, please ignore',
        body: '```how do you like them markdowns```'
      }, next);
    });
  });
});
