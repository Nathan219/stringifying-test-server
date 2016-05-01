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

  for(var x = 0; x < attempts; x++) {
    doThis();
  }
  return (new Date() - start) / attempts;
}
function writeItAll(factor, depth, times) {
  return writeIt(factor, depth) +
    'Stringified: ' + times.stringifiedTime + ' ms<br />' +
    'To JSON: ' + times.jsonedTime + ' ms<br />'
}
function writeIt(factor, depth) {
  return 'objects with between ' +  Math.pow(10, factor) +' and ' + Math.pow(10, factor + 1) + ' properties, and a depth of ' + depth;
}

function testIt(objectToTest, attempts) {
  // First stringify
  var circular = false;
  try {
    var stringified = JSON.stringify(objectToTest);
  } catch (err) {
    circular = true;
    stringified = JSON.stringifyOnce(objectToTest);
  }
  if (circular) {
    var stringifiedTime = timeIt(function () {
      var stringified = JSON.stringifyOnce(objectToTest);
      console.log(stringified)
    }, attempts);
    var jsonedTime = timeIt(function () {
      var jsoned = JSON.parse(stringified);
      console.log(jsoned);
    }, attempts);
  } else {
    stringifiedTime = timeIt(function () {
      var stringified = JSON.stringify(objectToTest);
      console.log(stringified)
    }, attempts);
    jsonedTime = timeIt(function () {
      var jsoned = JSON.parse(stringified);
      console.log(jsoned);
    }, attempts);
  }

  return {
    stringifiedTime: stringifiedTime,
    jsonedTime: jsonedTime
  }

}

module.exports = {
  createObject: createObject,
  testIt: testIt,
  writeIt: writeIt
};