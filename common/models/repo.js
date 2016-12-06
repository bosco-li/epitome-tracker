'use strict';

var _ = require('lodash');
var async = require('async');
var jenkins = require('../../lib/jenkins');
var gh = require('../../lib/github');

var CURRENT_STATE;

module.exports = function(Repo) {

  Repo.getStatus = function(cb) {
    cb = cb || function() {};
    var self = this;
    async.parallel([
      getRepos,
      jenkins.getAllBuildStatus,
    ], function(err, results) {
      results = _.map(results[0], function(repo) {
        return _.assign(repo, _.find(results[1], {
          name: repo.name,
        }));
      });
      async.concat(results, function(repo, cb) {
        repo['snap_ts'] = new Date();
        return cb(null, repo);
      }, function(err, results) {
        CURRENT_STATE = results;
        // console.log(results);
        return cb(null, results);
      });
    });
  };

  Repo.status = function(cb) {
    var self = this;
    if (!CURRENT_STATE) {
      return self.getStatus(cb);
    }
    return cb(null, CURRENT_STATE);
  };

  Repo.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get',
      },
      returns: {
        root: true,
        type: 'object',
      },
    }
  );
};

function getRepos(cb) {
  return gh.getAllRepos(cb);
}

function getIssues(repos, cb) {
  async.waterfall([
    gh.getAllRepos,
    function(repo, cb) {
      async.concat(repo, gh.getIssues, cb);
    },
  ], cb);
}
