'use strict'

var express = require('express');
var utils = require('../util.js');
var router = express.Router();

/* GET home page. */
//router.get('/hard', function(req, res) {
//  var factor = 1;
//  var depth = 0;
//  var attempts = 2;
//  var goalTime = 1000;
//  var times = {};
//  do {
//    factor++;
//    depth = 0;
//    for(; depth < 4; depth) {
//      var newObject = utils.createObject(factor, depth);
//      times = utils.runTests(newObject, attempts);
//    }
//  } while (times.jsonedTime < goalTime && times.jsonedTime < goalTime);
//  var message = utils.writeOutFactorAndDepth(factor, depth);
//  res.render('index', utils.extractTimes({
//    title: 'Express',
//    message: message
//  }, times));
//});

router.get('/diy', function(req, res) {
  var factor = parseInt(req.query.factor) || 1;
  var depth =  parseInt(req.query.depth) || 2;
  var randomProperties = !!req.query.random;

  depth = utils.makeBetweenMaxAndMinDepth(depth);
  factor = utils.makeBetweenMaxAndMin(factor);
  if (factor > 2) {
    randomProperties = true;
  }
  var attempts = 10;
  var newObject = utils.createObject(factor, depth, randomProperties);
  var times = utils.runTests(newObject, attempts);
  var message = utils.writeOutFactorAndDepth(factor, depth, randomProperties);
  res.render('index', utils.extractTimes({
    title: 'Express',
    message: message
  }, times));
});

router.get('/', function(req, res) {
  var factor = 2;
  var depth = 2;
  var attempts = 10;
  var newObject = utils.createObject(factor, depth, true);
  var times = utils.runTests(newObject, attempts);
  var message = utils.writeOutFactorAndDepth(factor, depth, true);
  res.render('index', utils.extractTimes({
    title: 'Express',
    message: message
  }, times));
});

router.get('/req', function(req, res) {
  var attempts = 50;
  console.log('');
  var times = utils.runTests(req, attempts, true);
  res.render('index', utils.extractTimes({
    title: 'Express',
    message: 'The REQ object containing ' + Object.keys(req).length + ' and is Circular'
  }, times));
});

module.exports = router;
