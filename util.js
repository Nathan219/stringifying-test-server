'use strict';
var randomstring = require('randomstring');
var fs = require('fs');

var MAX_FACTOR = 4;
var MAX_DEPTH = 40;

function makeBetweenMaxAndMin(value) {
  return (value < 1) ? 1 : (value > MAX_FACTOR) ? MAX_FACTOR : value
}
function makeBetweenMaxAndMinDepth(value) {
  return (value < 1) ? 1 : (value > MAX_DEPTH) ? MAX_DEPTH : value
}

function createObject(factor, depth, randomProperties) {
  console.log('Creating at Depth ', depth);
  if (!depth) {
    return randomstring.generate()
  }
  factor = makeBetweenMaxAndMin(factor);
  var newObject = {};
  var min = 1; //Math.pow(10, factor - 1);
  var max = Math.pow(10, factor);
  var amount = (randomProperties) ? Math.random() * (max - min) + min : max;
  for(var x = 0; x < amount; x++) {
    newObject[randomstring.generate()] = createObject(factor - 1, depth - 1)
  }
  return newObject
}

function extractTimes(optsToAddTo, times) {
  ['stringified', 'console', 'log', 'parse'].forEach(function (test) {
    optsToAddTo[test] = times[test];
  });
  return optsToAddTo;
}

function timeIt(whichStringify, objectToTest, attempts) {
  fs.writeFileSync('./testPrinting.log', '');
  var totalStringifiedTime = 0;
  var totalConsoleTime = 0;
  var totalLogTime = 0;
  var totalParseTime = 0;
  for(var x = 0; x < attempts; x++) {
    console.log('attempt ', x);
    var times = printAndTimeIt(whichStringify, objectToTest);
    // We want to add up the time differences
    totalStringifiedTime += times.stringifiedTime;
    totalConsoleTime += times.consoleTime;
    totalLogTime += times.logTime;
    totalParseTime += times.parseTime;
  }
  return {
    stringified: totalStringifiedTime / attempts,
    console: totalConsoleTime / attempts,
    log: totalLogTime / attempts,
    parse: totalParseTime / attempts
  }
}

function writeOutFactorAndDepth(factor, depth, randomProperties) {
  var between = (randomProperties) ? 'between ' +  Math.pow(10, factor - 1) + ' and ' : '';
  return 'objects with ' + between + Math.pow(10, factor) +
    ' properties, and a depth of ' + depth;
}

function printAndTimeIt(whichStringify, objectToTest) {
  var start = new Date();
  var stringified = JSON[whichStringify](objectToTest);
  var stringifyTime = new Date();
  console.log(stringified);
  var consoleTime = new Date();
  fs.appendFileSync('./testPrinting.log', stringified);
  var logTime = new Date();
  var newObject = JSON.parse(stringified);
  var parseTime = new Date();
  return {
    start: start,
    stringifiedTime: stringifyTime - start,
    consoleTime: consoleTime - stringifyTime,
    logTime: logTime - consoleTime,
    parseTime: parseTime - logTime,
    finish: parseTime
  };
}

function runTests(objectToTest, attempts, useStringifyOnce) {
  // Since req can't stringify because it's circular
  var whichStringify = (useStringifyOnce) ? 'stringifyOnce': 'stringify';

  return timeIt(whichStringify, objectToTest, attempts);

}

module.exports = {
  createObject: createObject,
  runTests: runTests,
  writeOutFactorAndDepth: writeOutFactorAndDepth,
  extractTimes: extractTimes,
  makeBetweenMaxAndMin: makeBetweenMaxAndMin,
  makeBetweenMaxAndMinDepth: makeBetweenMaxAndMinDepth
};