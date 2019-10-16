describe('githulk.webhooks', function () {
  'use strict';

var hulk = require('./hulk')
  , assume = hulk.assume
  , githulk = hulk.hulk
  , hooks = hulk.webhooks;

  this.timeout(30000);

  describe('.create', function () {
    Object.keys(hooks).forEach(function (type) {
      var hook = hooks[type];
      it('should create webhook for ' + type, function (next) {
        githulk.webhooks.create(hook.repo, hook.options, function (err, result) {
          assume(err).to.be.falsey();
          assume(result.name).equals(hook.type || type);
          next();
        });
      });
    });
  });

  describe('.list', function () {
    it('lists the set of webhooks that currently exist', function (next) {
      githulk.webhooks.list(hooks.jenkins.repo, function (err, result) {
        assume(err).to.be.falsey();
        assume(result.length).equals(2);
        next();
      });
    });
  });

  describe('.get', function () {
    var webhooks;
    before(function (next) {
      githulk.webhooks.list(hooks.jenkins.repo, function (err, results) {
        webhooks = results;
        next(err);
      });
    });

    it('should be able to get the all webhook by id', function (next) {
      next = assume.wait(2, 4, next);
      webhooks.forEach(function (hook) {
        githulk.webhooks.get(hooks.jenkins.repo, {
          id: hook.id
        }, function (err, result) {
          assume(err).to.be.falsey();
          assume(result.name).equals(hook.name);
          next();
        });
      });
    });
  });

  describe('.delete', function () {
    var webhooks;
    before(function (next) {
      githulk.webhooks.list(hooks.jenkins.repo, function (err, results) {
        webhooks = results;
        next(err);
      });
    });

    it('should be able to delete the webhook by id', function (next) {
      next = assume.wait(2, 2, next);
      webhooks.forEach(function (hook) {
        githulk.webhooks.delete(hooks.jenkins.repo, {
          id: hook.id
        }, function (err) {
          assume(err).is.falsey();
          next();
        });
      });
    });
  });
});
