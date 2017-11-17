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

  describe('.branch', function () {
    it('gets details about a branch', function (next) {
      githulk.repository.branch('twbs/bootstrap', { branch: 'gh-pages' }, function (err, branch) {
        if (err) return next(err);

        assume(branch).is.an('object');
        assume(branch.name).to.be.a('string');
        assume(branch.commit).to.be.an('object');

        next();
      });
    });
  });

  describe('.tags', function () {
    it('lists all tags', function (next) {
      githulk.repository.tags('twbs/bootstrap', function (err, tags) {
        if (err) return next(err);

        assume(tags).is.a('array');
        tags.forEach(function (tag) {
          assume(tag.ref).to.be.a('string');

          assume(tag.object).to.be.an('object');
          assume(tag.object.sha).to.be.a('string');
          assume(tag.object.type).to.be.a('string');
        });

        next();
      });
    });
  });

  describe('.tag', function () {
    it('gets a single tag', function (next) {
      githulk.repository.tag('twbs/bootstrap', { tag: 'v3.3.7' }, function (err, tag) {
        if (err) return next(err);

        assume(tag).is.an('object');
        assume(tag.ref).to.be.a('string');
        assume(tag.ref).includes('v3.3.7');

        assume(tag.object).to.be.an('object');
        assume(tag.object.sha).to.be.a('string');
        assume(tag.object.type).to.be.a('string');

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

  describe('.commitSha', function () {
    it('get the LONG SHA for a specific commit', function (next) {

      githulk.repository.commitSha('twbs/bootstrap', { sha: 'f2e912b' }, function (err, longSha) {
        if (err) return next(err);

        assume(longSha).is.a('string');
        assume(longSha).equals('f2e912bb0e5041fead48bdbcaaa23de1c40291d5');

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
