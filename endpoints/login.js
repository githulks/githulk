'use strict';

var crypto = require('crypto')
  , url = require('url');

/**
 * Expose a login API endpoint.
 *
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Login(api) {
  this.send = api.send.bind(api);
  this.qs = api.querystringify;
  this.api = api;
}

/**
 * Transform a response into an GitHub authorization hook
 *
 * @param {Response} res HTTP Response instance to answer.
 * @param {String} client The application client id.
 * @param {Array} scopes The OAuth access scopes.
 * @returns {String} The state.
 * @api public
 */
Login.prototype.authorize = function authorize(res, client, scopes, redirect) {
  var state = crypto.randomBytes(8).toString('hex');

  res.statusCode = 302;
  res.setHeader('Location', url.resolve(this.api.api, 'login/oauth/authorize'+ this.qs(
    {
      scope: (Array.isArray(scopes) ? scopes : [scopes]).join(','),
      redirect_url: redirect,
      client_id: client,
      state: state
  }, ['client_id','scope', 'redirect_uri', 'state']
  )));

  return state;
};

/**
 * Process the OAuth callback from GitHub.
 *
 * @param {Request} req The incoming HTTP request.
 * @param {String} client The application client id.
 * @param {String} secret The application client secret.
 * @param {String} state The returned state token from the .authorize method.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Login.prototype.callback = function callback(req, client, secret, state, fn) {
  var data = url.parse(req.url, true).query;

  return this.send(
    ['login', 'oauth', 'access_token'],
    {
      params: ['client_id', 'client_secret', 'code', 'state'],
      client_id: client,
      client_secret: secret,
      code: data.code,
      state: state
    },
    fn
  );
};

//
// Expose the login API.
//
module.exports = Login;
