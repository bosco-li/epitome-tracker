'use strict';

var _ = require('lodash');
var Github = require('github');
var async = require('async');
var sprint = require('./sprint.js');

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

exports.TOKEN = TOKEN;

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
      var issues = [];
      repos.forEach(function(repo, i) {
        issues[i] = getIssues.bind(null, repos[i]);
      });
      var currentSprint = sprint.getCurrentSprint(new Date());
      async.series(issues, function(err, results) {
        results.forEach(function(result, i) {
          repos[i].new_issues = _.size(newIssues(result, currentSprint.startTime, currentSprint.endTime));
          repos[i].closed_issues = _.size(closedIssues(result, currentSprint.startTime, currentSprint.endTime));
          repos[i].new_prs = _.size(newPRs(result, currentSprint.startTime, currentSprint.endTime));
          repos[i].sprint_start_ts = currentSprint.startTime;
          repos[i].sprint_end_ts = currentSprint.endTime;
          repos[i].current_sprint = currentSprint.sprint;
        });
        return cb(null, repos);

      });
    }
  }
};

function closedIssues(issues, startTime, endTime) {
  return _.filter(issues, function(o) {
    var closedTime = new Date(o.closed_at);
    return !o.pull_request && o.state === 'closed' && closedTime.getTime() >= startTime.getTime() && closedTime.getTime() <= endTime.getTime();
  });
}

function openIssues(issues) {
  return _.filter(issues, function(o) {
    return !o.pull_request && o.state === 'open';
  });
}

function newIssues(issues, startTime, endTime) {
  return _.filter(issues, function(o) {
    var createdTime = new Date(o.created_at);
    return !o.pull_request && o.state === 'open' && createdTime.getTime() >= startTime.getTime() && createdTime.getTime() <= endTime.getTime();
  });
}

function openPRs(issues) {
  return _.filter(issues, function(o) {
    return o.pull_request && o.state === 'open';
  });
}

function newPRs(issues, startTime, endTime) {
  return _.filter(issues, function(o) {
    var createdTime = new Date(o.created_at);
    return o.pull_request && o.state === 'open' && createdTime.getTime() >= startTime.getTime() && createdTime.getTime() <= endTime.getTime();
  });
}

function getIssues(repo, cb) {
  console.log('Processing ' + repo.name + '...');
  var issues = [];
  var currentSprint = sprint.getCurrentSprint(new Date());
  github.issues.getForRepo({
    owner: repo.owner.login,
    repo: repo.name,
    'per_page': 100,
    state: 'all',
    since: currentSprint.startTime
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
