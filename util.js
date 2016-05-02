'use strict';
var randomstring = require("randomstring");

function createObject(factor, depth) {
  factor = (factor > 0) ? factor : 0;
  var newObject = {};
  var min = Math.pow(10, factor);
  var max = Math.pow(10, factor + 1);
  var amount = Math.random() * (max - min) + min;
  for(var x = 0; x < amount; x++) {
    newObject[randomstring.generate()] = (depth) ? createObject(factor - 1, depth - 1) : randomstring.generate()
  }
  return newObject
}

function timeIt(doThis, attempts) {
  var start = new Date();

  var withoutPrintingTotalTime = 0;
  for(var x = 0; x < attempts; x++) {
    var thisStart = new Date();
    var withoutPrintingTime = doThis();
    // We want to add up the time differences
    withoutPrintingTotalTime += (withoutPrintingTime - thisStart);
  }
  var end = new Date();
  return {
      action: withoutPrintingTotalTime / attempts,
      total: (end - start) / attempts
  }
}

function writeOutFactorAndDepth(factor, depth) {
  return 'objects with between ' +  Math.pow(10, factor) +' and ' + Math.pow(10, factor + 1) + ' properties, and a depth of ' + depth;
}

function testIt(objectToTest, attempts) {
  // First stringify
  var whichStringify = 'stringify';
  try {
    var stringified = JSON.stringify(objectToTest);
  } catch (err) {
    whichStringify = 'stringifyOnce';
    stringified = JSON.stringifyOnce(objectToTest);
  }

  var stringifiedTime = timeIt(function () {
    var stringified = JSON[whichStringify](objectToTest);
    var time = new Date();
    console.log(stringified);
    return time;
  }, attempts);

  var jsonedTime = timeIt(function () {
    var jsoned = JSON.parse(stringified);
    var time = new Date();
    console.log(jsoned);
    return time;
  }, attempts);

  return {
    stringifiedTime: stringifiedTime,
    jsonedTime: jsonedTime
  }

}

module.exports = {
  createObject: createObject,
  testIt: testIt,
  writeIt: writeOutFactorAndDepth
};