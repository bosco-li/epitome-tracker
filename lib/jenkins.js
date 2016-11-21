'use strict';

var _ = require('lodash');
var request = require('request');
var url = require('url');

var USER = 'pthieu';
try {
  var TOKEN = require('../config/tokens').JENKINS;
} catch (e) {
  console.error('Error: could not read Jenkins token');
  return process.exit(0);
}

exports.getAllBuildStatus = function(cb) {
  var uri = url.format({
    auth: [USER, TOKEN].join(':'),
    hostname: 'ci.strongloop.com',
    protocol: 'http',
    pathname: '/view/Loopback/api/json',
  });

  var reqOpts = {
    url: uri,
    method: 'GET',
    rejectUnauthorized: false,
  };
  request(reqOpts, function(err, res, body) {
    if (err) {
      return cb(err);
    }
    try {
      var jsonBody = JSON.parse(body);
      var results = jsonBody.jobs;
    } catch (e) {
      return cb(e);
    }
    results = _.filter(results, function(repo) {
      if (repo.name.match(/\.(pr|dependants|staging)/gi)) {
        return false;
      } else {
        return true;
      }
    });

    results = _.map(results, function(repo) {
      return {
        name: repo.name,
        url: repo.url,
        status: repo.color,
      };
    });

    return cb(null, results);
  });
};
