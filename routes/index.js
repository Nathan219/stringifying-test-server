'use strict'

var express = require('express');
var utils = require('../util.js');
var router = express.Router();

router.get('/diy', function(req, res) {
  var factor = parseInt(req.query.factor) || 1;
  var depth =  parseInt(req.query.depth) || 2;
  var randomProperties = !!req.query.random;

  depth = utils.minMaxDepth(depth);
  factor = utils.minMaxFactor(factor);
  var attempts = 10;
  if (factor > 2) {
    randomProperties = true;
    attempts = 2;
  }
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
