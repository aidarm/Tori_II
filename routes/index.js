var express = require('express');
var router = express.Router();
var passport = require('passport');
var itemService = require('../services/item-service');
var restrict = require('../auth/restrict');

/* GET home page. */
router.get('/', function(req, res, next) {
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // };
  
  var vm = {
    firstName: req.user ? req.user.firstName : null
  };
  
  // itemService.findItem(function(err, item) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   if (item) {
  //     res.render('index', {products: item});
  //   }
  // });
  
  res.render('index', vm);

});

router.post('/', function(req, res, next) {
  console.log(req.body);
  itemService.findItem(function(err, item, next) {
    if (err) {
      console.log(err);
    }
    if (item) {
      res.send(item);
    }
  });
});

router.get('/cat/cars', function(req, res, next) {
  res.render('item/cat');
});

router.get('/cat/houses', function(req, res, next) {
  res.render('item/cat');
});

router.post('/login', 
  passport.authenticate('local', {
    // failureRedirect: '/', 
    // successRedirect: '/',
  }),
  
  function(req, res, next) {
    res.send("DONE!");
});

router.get('/logout', function(req, res, next) {
  req.logout();
  //req.session.destroy();
  res.redirect('/');
});

router.get('/admin', restrict, function(req, res, next) {

});



module.exports = router;