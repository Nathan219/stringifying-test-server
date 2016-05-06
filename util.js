'use strict';
var randomstring = require('randomstring');
var fs = require('fs');

var MAX_FACTOR = 4;
var MAX_DEPTH = 40;

function minMaxFactor(value) {
  return (value < 1) ? 1 : (value > MAX_FACTOR) ? MAX_FACTOR : value
}
function minMaxDepth(value) {
  return (value < 1) ? 1 : (value > MAX_DEPTH) ? MAX_DEPTH : value
}

/**
 * Creates an object based on the given inputs
 * @param factor           {Number}  Factor of 10 which should the upper bound of properties created
 * @param depth            {Number}  Amount of layers of sub-objects created
 * @param randomProperties {Boolean} True if the amount of properties was between 10 * factor-1 and
 *                                   10 * factor properties
 * @returns {{Object}} Hopefully what you asked for
 */
function createObject(factor, depth, randomProperties) {
  console.log('Creating at Depth ', depth);
  if (!depth) {
    return randomstring.generate()
  }
  factor = minMaxFactor(factor);
  var newObject = {};
  var min = Math.pow(10, factor - 1);
  var max = Math.pow(10, factor);
  var amount = (randomProperties) ? Math.random() * (max - min) + min : max;
  for(var x = 0; x < amount; x++) {
    newObject[randomstring.generate()] = createObject(factor - 1, depth - 1)
  }
  return newObject
}

/**
 * Just extracts the times out of TIMES and adds them to OPTSTOADD
 * @param optsToAddTo {Object} Object to add properties to
 * @param times             {Object} Times object from RunTests
 * @param times.stringified {Number} Time taken to stringify the object
 * @param times.console     {Number} Time taken to print the stringified to console
 * @param times.log         {Number} Time taken to log the stringified to a file
 * @param times.parse       {Number} Time taken to JSON parse the stringified
 * @returns {Object} optsToAddTo with the times added
 */
function extractTimes(optsToAddTo, times) {
  ['stringified', 'console', 'log', 'parse'].forEach(function (test) {
    optsToAddTo[test] = times[test];
  });
  return optsToAddTo;
}

/**
 * Takes an object to test, and runs the test for ATTEMPTS amount of times.
 * @param objectToTest     {Object}  This is the object to stringify
 * @param attempts         {Number}  Amount of times to run the test to increase the precision
 * @param useStringifyOnce {Boolean} True if we should use stringifyOnce instead of stringify.
 *                                   Usually for circular objects
 * @returns {{stringified: Number, console: Number, log: Number, parse: Number}} Timing results
 */
function runTests(objectToTest, attempts, useStringifyOnce) {
  fs.writeFileSync('./testPrinting.log', '');
  var totalStringifiedTime = 0;
  var totalConsoleTime = 0;
  var totalLogTime = 0;
  var totalParseTime = 0;
  for(var x = 0; x < attempts; x++) {
    console.log('attempt ', x);
    var times = printAndTimeIt(objectToTest, useStringifyOnce);
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
/**
 * Writes out the selections for Factor and Depth in a human-readable way
 * @param factor           {Number}  Factor of 10 which was the upper bound of properties created
 * @param depth            {Number}  Amount of layers of sub-objects created
 * @param randomProperties {Boolean} True if the amount of properties was between
 *                                   10 * factor-1 and 10 * factor properties
 * @returns {String} Human-readable interpretation of all the properties
 */
function writeOutFactorAndDepth(factor, depth, randomProperties) {
  var between = (randomProperties) ? 'between ' +  Math.pow(10, factor - 1) + ' and ' : '';
  return 'objects with ' + between + Math.pow(10, factor) +
    ' properties, and a depth of ' + depth;
}

/**
 * Given an object, this function times how long it takes to JSON.stringify it, log it to console,
 * log it to a file, and even re-parsing that value back to an object.
 * @param objectToTest     {Object}  This is the object to stringify
 * @param useStringifyOnce {Boolean} True if we should use stringifyOnce instead of stringify.
 *                                   Usually for circular objects
 * @returns {{start: Date, stringifiedTime: number, consoleTime: number, logTime: number, parseTime: number, finish: Date}}
 */
function printAndTimeIt(objectToTest, useStringifyOnce) {
  // In case the object is circular, we may need to use stringifyOnce
  var whichStringify = (useStringifyOnce) ? 'stringifyOnce': 'stringify';
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

module.exports = {
  createObject: createObject,
  runTests: runTests,
  writeOutFactorAndDepth: writeOutFactorAndDepth,
  extractTimes: extractTimes,
  minMaxFactor: minMaxFactor,
  minMaxDepth: minMaxDepth
};