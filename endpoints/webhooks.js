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
 *
 */
Webhook.prototype.create = function (args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options, Webhook.create);

  var project = this.api.project(args.str);

  return this.send(
    ['repos', project.user, project.repo, 'hooks'],
    args.options,
    args.fn
  );
};

module.exports = Webhook;
