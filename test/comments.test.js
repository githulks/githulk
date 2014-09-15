describe('githulk.comments', function () {
  'use strict';

  var hulk = require('./hulk')
    , assume = hulk.assume
    , githulk = hulk.hulk
    , id;

  this.timeout(30000);

  describe('.list', function () {
    it('lists all comments on the specified repository', function (next) {
      githulk.comments.list(hulk.repo, hulk.issues.comments, function (err, comments) {
        if (err) return next(err);

        assume(comments).is.a('array');
        assume(comments.length).to.equal(1);
        assume(comments[0].user.login).to.equal(hulk.owner);

        next();
      });
    });
  });

  describe('.repository', function () {
    it('lists all comments from all isues', function (next) {
      githulk.comments.repository(hulk.repo, function (err, comments) {
        if (err) return next(err);

        assume(comments).to.be.a('array');
        assume(comments.length).to.be.above(1);
        assume(comments.some(function woop(comment) {
          return comment.user.login === hulk.owner;
        })).to.be.true();

        next();
      });
    });
  });

  describe('.get', function () {
    it('returns a single comment', function (next) {
      githulk.comments.get(hulk.repo, hulk.comment, function (err, data) {
        if (err) return next(err);
        data = Array.isArray(data) ? data.pop() : data;

        assume(data.user.login === hulk.owner);
        assume(data.id).to.equal(hulk.comment);

        next();
      });
    });
  });

  describe('.create', function () {
    var body = 'This comment was automatically generated through the API **this is a test**';

    it('adds a new comment to the issue', function (next)  {
      githulk.comments.create(hulk.repo, hulk.issues.comments, {
        body: body
      }, function (err, data) {
        if (err) return next(err);
        data = Array.isArray(data) ? data.pop() : data;

        githulk.comments.get(hulk.repo, data.id, function (err, data) {
          if (err) return next(err);
          data = Array.isArray(data) ? data.pop() : data;

          assume(data.body).to.equal(body);
          id = data.id; // needed for deleting

          next();
        });
      });
    });
  });

  describe('.edit', function () {
    var body = 'This comment was changed through the API :+1: ';

    it('changes the content of the comment', function index(next) {
      githulk.comments.edit(hulk.repo, id, { body: body }, function (err) {
        if (err) return next(err);

        githulk.comments.get(hulk.repo, id, function (err, data) {
          if (err) return next(err);
          data = Array.isArray(data) ? data.pop() : data;

          assume(data.body).to.equal(body);
          next();
        });
      });
    });
  });

  describe('.remove', function () {
    it('removes the issue', function (next) {
      githulk.comments.remove(hulk.repo, id, function (err) {
        if (err) return next(err);

        githulk.comments.get(hulk.repo, id, function (err, data) {
          if (!err) return next(new Error('I should error, does not exist'));
          next();
        });
      });
    });
  });
});
