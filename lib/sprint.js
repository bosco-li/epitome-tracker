var START = new Date('Mon Nov 14 2016 0:00:00 GMT-0500 (EST)');
var SPRINT_INTERVAL = 14; // in days

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getCurrentSprint(date) {

  var currentSpint = 1;
  var startTime = START;
  var endTime = addDays(START, SPRINT_INTERVAL);

  while (!inBetween(date, startTime, endTime)) {
    currentSpint++;
    startTime = endTime;
    endTime = addDays(startTime, SPRINT_INTERVAL);
  }

  return {
    sprint: currentSpint,
    startTime: startTime,
    endTime: endTime
  };
}

function inBetween(currentTime, startTime, endTime) {
  return currentTime.getTime() >= startTime.getTime() && currentTime.getTime() <= endTime.getTime();
}

module.exports = {
  addDays: addDays,
  getCurrentSprint: getCurrentSprint
}
