var express = require('express');
var router = express.Router();
var passport = require('passport');
var userService = require('../services/user-service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/cat/cars', function(req, res, next) {
  res.render('item/cat');
});

router.get('/cat/houses', function(req, res, next) {
  res.render('item/cat');
});

router.post('/login', 
  passport.authenticate('local'),
  
  function(req, res, next) {
    res.send("DONE!");
});

module.exports = router;
