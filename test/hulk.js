'use strict';

var assume = require('assume')
  , GitHulk = require('../');

exports.hulk = new GitHulk({ token: process.env.GITHULK_TEST });
exports.repo = '3rd-Eden/githulk';
exports.owner = '3rd-Eden';
exports.GitHulk = GitHulk;
exports.assume = assume;
