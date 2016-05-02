var express = require('express');
var utils = require('../util.js');
var router = express.Router();

/* GET home page. */
router.get('/hard', function(req, res, next) {
  var factor = 1;
  var depth = 0;
  var attempts = 2;
  var goalTime = 1000;
  var times = {};
  do {
    factor++;
    depth = 0;
    for(; depth < 4; depth) {
      var newObject = utils.createObject(factor, depth);
      times = utils.testIt(newObject, attempts);
    }
  } while (times.jsonedTime < goalTime && times.jsonedTime < goalTime);
  var message = utils.writeIt(factor, depth, times);
  res.render('index', {
    title: 'Express',
    message: message
  });
});

router.get('/diy', function(req, res, next) {
  var factor = parseInt(req.query.factor) || 1;
  var depth =  parseInt(req.query.depth) || 2;
  var attempts = 10;
  var newObject = utils.createObject(factor, depth);
  var times = utils.testIt(newObject, attempts);
  var message = utils.writeIt(factor, depth, times);
  res.render('index', {
    title: 'Express',
    message: message,
    stringifiedTime: times.stringifiedTime.action,
    stringifiedTimeTotal: times.stringifiedTime.total,
    jsonedTime: times.jsonedTime.action,
    jsonedTimeTotal: times.jsonedTime.total
  });
});

router.get('/', function(req, res, next) {
  var factor = 1;
  var depth = 2;
  var attempts = 10;
  var goalTime = 1000;
  var times = {};
  var newObject = utils.createObject(factor, depth);
  times = utils.testIt(newObject, attempts);
  var message = utils.writeIt(factor, depth, times);
  res.render('index', {
    title: 'Express',
    message: message,
    stringifiedTime: times.stringifiedTime.action,
    stringifiedTimeTotal: times.stringifiedTime.total,
    jsonedTime: times.jsonedTime.action,
    jsonedTimeTotal: times.jsonedTime.total
  });
});

router.get('/req', function(req, res, next) {
  var attempts = 50;
  console.log('');
  var times = utils.testIt(req, attempts);
  res.render('index', {
    title: 'Express',
    message: 'Parsing Req (with ' + Object.keys(req).length + ' properties)',
    stringifiedTime: times.stringifiedTime.action,
    stringifiedTimeTotal: times.stringifiedTime.total,
    jsonedTime: times.jsonedTime.action,
    jsonedTimeTotal: times.jsonedTime.total
  });
});

module.exports = router;
