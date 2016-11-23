'use strict';

var _ = require('lodash');
var Github = require('github');

try {
  var TOKEN = require('../config/tokens').GITHUB;
} catch (e) {
  console.error('Error: could not read GitHub token');
  return process.exit(0);
}

var github = new Github({
  headers: {
    'user-agent': 'Epitome-Team-Tracker',
  },
  Promise: require('bluebird'),
  followRedirects: false,
  timeout: 10000,
});

github.authenticate({
  type: 'token',
  token: TOKEN,
});

exports.getAllRepos = function(cb) {
  var repos = [];
  github.repos.getForOrg({
    org: 'strongloop',
    'per_page': 100,
  }, getNextPage);

  function getNextPage(err, res) {
    if (err) {
      return cb(err);
    }
    repos = repos.concat(res);
    if (github.hasNextPage(res)) {
      github.getNextPage(res, getNextPage);
    } else {
      repos = _.filter(repos, function(repo) {
        return repo.name.match(/loopback/i);
      });
      repos = _.map(repos, function(repo) {
        return _.pick(repo, [
          'name',
          'full_name',
          'html_url',
          'description',
          'open_issues',
          'owner.login',
        ]);
      });
      repos = _.sortBy(repos, function(repo) {
        return repo.name;
      });
      return cb(null, repos);
    }
  }
};

exports.getIssues = function(repo, cb) {
  var issues = [];
  github.issues.getForRepo({
    owner: repo.owner.login,
    repo: repo.name,
  }, getNextPage);

  function getNextPage(err, res) {
    if (err) {
      return cb(err);
    }
    issues = issues.concat(res);
    if (github.hasNextPage(res)) {
      github.getNextPage(res, getNextPage);
    } else {
      return cb(null, issues);
    }
  }
};
