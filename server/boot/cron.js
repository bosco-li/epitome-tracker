'use strict';

var CronJob = require('cron').CronJob;

module.exports = function(server) {
  var Repo = server.models.Repo;
  // Grabs repo status and saves it into memory so we don't hit the rate-limit
  // for GH or Jenkins if a lot of people are refreshing their page
  var updateRepo = new CronJob({
    cronTime: '* 10 * * * *',
    // onTick: Repo.getStatus,
    onTick: function() {
      Repo.getStatus(function(err, results) {
        Repo.create(results);
      });
    },
    start: true,
    runOnInit: true,
  });

  // Grabs repo information and saves it every night
  // var saveRepo = new CronJob({
  //   cronTime: '00 00 1 * * *',
  //   onTick: function() {
  //     Repo.getStatus(function(err, results) {
  //       Repo.create(results);
  //     });
  //   },
  //   start: true,
  //   timeZone: 'America/Toronto',
  // });
};
