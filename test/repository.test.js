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

  describe('.commits', function () {
    it('lists commits', function (next) {
      githulk.repository.commits('foreverjs/forever', function (err, commits) {
        if (err) return next(err);

        assume(commits).is.a('array');
        commits.forEach(function (commit) {
          assume(commit.sha).to.be.a('string');
          assume(commit.commit).to.be.an('object');
        });

        next();
      });
    });
  });

  describe('.contents', function () {
    it('returns an error when getting files from an unknown repo', function (next) {
      githulk.repository.contents('3rd-Eden/githulk-doesnt-exist-please', { path: '/index.js' }, function (err) {
        assume(err).is.a('error');
        next();
      });
    });

    it('returns array for directory', function (next) {
      githulk.repository.contents(hulk.repo, { path: 'endpoints' }, function (err, results) {
        if (err) return next(err);

        assume(results).is.a('array');

        next();
      });
    });

    it('returns array for directory with a single file', function (next) {
      githulk.repository.contents('indexzero/indexzero', { path: 'test' }, function (err, results) {
        if (err) return next(err);

        assume(results).is.a('array');

        next();
      });
    });

    it('returns object for file', function (next) {
      githulk.repository.contents(hulk.repo, { path: '/index.js' }, function (err, result) {
        if (err) return next(err);

        assume(result).to.be.an('object');
        assume(result).owns('content');

        next();
      });
    });

    it('returns object for submodule', function (next) {
      githulk.repository.contents('githulks/githulk-test', { path: 'githulk' }, function (err, result) {
        if (err) return next(err);

        assume(result).to.be.an('object');
        assume(result).owns('submodule_git_url');

        next();
      });
    });

    it('returns symlink object for symlink to a directory', function (next) {
      githulk.repository.contents('githulks/githulk-test', { path: 'symlink-dir' }, function (err, result) {
        if (err) return next(err);

        assume(result).to.be.an('object');
        assume(result.type).equals('symlink');
        assume(result).owns('target');

        next();
      });
    });

    it('returns file object for symlink to a file', function (next) {
      githulk.repository.contents('githulks/githulk-test', { path: 'symlink' }, function (err, result) {
        if (err) return next(err);

        assume(result).to.be.an('object');
        assume(result.type).equals('file');

        next();
      });
    });

  });
});
