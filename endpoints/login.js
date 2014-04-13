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
  this.qs = api.querystring.bind(api);
  this.send = api.send.bind(api);
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
  var state = crypto.randomBytes(8).toString('hex')
    , endpoint = 'https://github.com/login/oauth/authorize'+ this.qs({
        scope: (Array.isArray(scopes) ? scopes : [scopes]).join(','),
        redirect_url: redirect,
        client_id: client,
        state: state
      }, ['client_id','scope', 'redirect_uri', 'state']);

  //
  // Optionally set store the `state` in the session so we can re-use it for the
  // callback.
  //
  if (res.session) res.session.oauth_state = state;

  if (res.redirect) {
    res.redirect(endpoint, 302);
  } else {
    res.setHeader('Location', endpoint);
    res.statusCode = 302;
    res.end('');
  }

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
  var data = url.parse(req.url, true).query
    , err;

  if ('function' === typeof state && req.session) {
    fn = state;
    state = req.session.oauth_state;
  }

  if (data.error) {
    err = new Error(data.error_description);
    err.url = data.error_uri;
    err.error = data.error;
  } else if (!data.code) {
    err = new Error('Missing OAuth code.');
  }

  if (err) return this.bail(fn, err);

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
