'use strict';

/**
 * Webhooks API endpoint
 *
 * @param {mana} api The actual API instance
 * @api private
 */
function Webhook(api) {
  this.send = api.send.bind(api);
  this.options = api.options;
  this.api = api;
}

/**
 * Unwrap a result into an object when necessary
 */
function unwrapper(fn) {
  return function unwrap(err, results) {
    if (err) { return fn(err); }
    return fn(undefined, results
        && results.length <= 1
          ? results[0]
          : results);
  };
}

/**
 * Properties we need in the body of the request for create
 */
Webhook.create = [
  'name',   // Name of a valid webhook service
  'config', // config, object with k, v for the service
  'events', // array of events that we hook into
  'active'  // specify a boolean whether the service is active
];

/**
 * Create a new webhook for the project
 */
Webhook.prototype.create = function (args) {
  args = this.api.args(arguments);
  args.options = this.options(this.api.merge(args.options, { method: 'POST' }), Webhook.create);

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'hooks'],
    args.options,
    unwrapper(args.fn)
  );
};

/**
 * Get a webhooks by id
 */
Webhook.prototype.get = function (args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str);
  args.options = this.options(args.options);
  var id = args.options.id;

  if (!id) {
    return args.fn(new Error('id is required parameter'));
  }

  return this.send(
    ['repos', project.user, project.repo, 'hooks', id],
    args.options,
    unwrapper(args.fn)
  );
};

/**
 * Delete a webhook for the given project and id
 */
Webhook.prototype.delete = function (args) {
  args = this.api.args(arguments);

  var project = this.api.project(args.str);
  args.options = this.options(this.api.merge(args.options, { method: 'DELETE' }), []);
  var id = args.options.id;

  if (!id) {
    return args.fn(new Error('id is required parameter'));
  }

  return this.send(
    ['repos', project.user, project.repo, 'hooks', id],
    args.options,
    unwrapper(args.fn)
  );
};

/**
 * List the webhooks for a given repo
 */
Webhook.prototype.list = function (args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options);

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'hooks'],
    args.options,
    unwrapper(args.fn)
  );
};

module.exports = Webhook;
