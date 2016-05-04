'use strict';
var randomstring = require('randomstring');
var fs = require('fs');

// If set to true, do not use a random value
var USE_FULL_FACTOR = true;

function createObject(factor, depth) {
  factor = (factor > 0) ? factor : 0;
  var newObject = {};
  var min = Math.pow(10, factor);
  var max = Math.pow(10, factor + 1);
  var amount = (USE_FULL_FACTOR) ? max : Math.random() * (max - min) + min;
  for(var x = 0; x < amount; x++) {
    newObject[randomstring.generate()] = (depth) ? createObject(factor - 1, depth - 1) : randomstring.generate()
  }
  return newObject
}

function extractTimes(optsToAddTo, times) {
  ['stringified', 'jsoned'].forEach(function (time) {
    ['action', 'console', 'log'].forEach(function (test) {
      optsToAddTo[time + '_' + test] = times[time][test];
    })
  });
  return optsToAddTo;
}

function timeIt(doThis, attempts) {
  var totalActionTime = 0;
  var totalConsoleTime = 0;
  var totalLogTime = 0;
  for(var x = 0; x < attempts; x++) {
    var times = printAndTimeIt(function () {
      return doThis();
    });
    // We want to add up the time differences
    totalActionTime += times.actionTime;
    totalConsoleTime += times.consoleTime;
    totalLogTime += times.logTime;
  }
  return {
    action: totalActionTime / attempts,
    console: totalConsoleTime / attempts,
    log: totalLogTime / attempts
  }
}

function writeOutFactorAndDepth(factor, depth) {
  return 'objects with between ' +  Math.pow(10, factor) +' and ' + Math.pow(10, factor + 1) +
    ' properties, and a depth of ' + depth;
}

function printAndTimeIt(doThis) {
  var start = new Date();
  var value = doThis();
  var actionTime = new Date();
  console.log(value);
  var consoleTime = new Date();
  fs.appendFileSync('./testPrinting.log', value);
  var logTime = new Date();
  return {
    start: start,
    actionTime: actionTime - start,
    consoleTime: consoleTime - actionTime,
    logTime: logTime - consoleTime,
    finish: logTime
  };
}

function runTests(objectToTest, attempts) {
  // First stringify to see if we even can do it
  var whichStringify = 'stringify';
  try {
    var stringified = JSON.stringify(objectToTest);
  } catch (err) {
    whichStringify = 'stringifyOnce';
    stringified = JSON.stringifyOnce(objectToTest);
  }

  var stringifiedTime = timeIt(function () {
    return JSON[whichStringify](objectToTest);
  }, attempts);

  var jsonedTime = timeIt(function () {
    return JSON.parse(stringified);
  }, attempts);

  return {
    stringified: stringifiedTime,
    jsoned: jsonedTime
  }

}

module.exports = {
  createObject: createObject,
  runTests: runTests,
  writeIt: writeOutFactorAndDepth,
  extractTimes: extractTimes
};