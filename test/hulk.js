'use strict';

var assume = require('assume')
  , GitHulk = require('../');

/**
 * A pre-configured GitHulk instance which will be used for testing purposes.
 *
 * @type {GitHulk}
 * @public
 */
exports.hulk = new GitHulk({ token: process.env.GITHULK_TEST });

/**
 * The id's of issues which are in various of states.
 *
 * @type {Object}
 * @public
 */
exports.issues = { closed: 3, open: 2, comments: 2 };

/**
 * The Github location of the repository.
 *
 * @type {String}
 * @public
 */
exports.repo = 'githulks/githulk';

/**
 * Name of the owner of the test suite and repository.
 *
 * @type {String}
 * @public
 */
exports.owner = '3rd-Eden';

/**
 * Example webhook fixture options used for testing
 */
exports.webhooks = {
  web: {
    repo: 'githulks/webhook-test',
    options: {
      name: 'web',
      config: {
        url: 'http://my-jenkins-server/ghprbhook/'
      },
      events: ['pull_request', 'pull_request_review_comment', 'issue_comment'],
      active: true
    }
  },
  // There are no more github service hooks, just regular webhooks
  jenkins: {
    repo: 'githulks/webhook-test',
    type: 'web',
    options: {
      name: 'web',
      config: {
        url: 'https://my-fun-times/github_webhook/'
      },
      events: ['push'],
      active: true
    }
  }
};

/**
 * A single comment id which we need to retrieve.
 *
 * @type {Number}
 * @public
 */
exports.comment = 55562200;

/**
 * Reference to the GitHulk constructor.
 *
 * @type {Function}
 * @public
 */
exports.GitHulk = GitHulk;

/**
 * Our assertion library.
 *
 * @type {Function}
 * @public
 */
exports.assume = assume;
