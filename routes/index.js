var express = require('express');
var router = express.Router();
//var passport = require('passport');
var itemService = require('../services/item-service');
var restrict = require('../auth/restrict');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    //console.log("You are authenticated on '/'");
  };
  
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

router.get(/.*$/, function(req, res, next) {
  
  if (req.isAuthenticated()) {
    
  };
  
  next();
  
  // var vm = {
  //   firstName: req.user ? req.user.firstName : null
  // };
  
  // res.send('index', vm);

});

router.post('/', function(req, res, next) {
  console.log(req.body);
  itemService.findItem(1, function(err, item, next) {
    if (err) {
      console.log(err);
    }
    if (item) {
      res.send(item);
    }
  });
});

router.get('/admin', restrict, function(req, res, next) {
  res.render('admin', req.user);
});

router.post('/admin', function(req, res, next) {
  console.log(req.body);
  itemService.findItem(0, function(err, item, next) {
    if (err) {
      console.log(err);
    }
    if (item) {
      res.send(item);
    }
  });
});

router.get('/cat/cars', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("You are authenticated on '/item/cat'");
  };
  res.render('item/cat', req.user);
});

router.get('/cat/houses', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("You are authenticated on '/item/cars'");
  };
  res.render('item/cat', req.user);
});

//THSI SHIT
router.get('/admin/:itemid', function(req, res, next) {
  res.render('item/item');
});

router.post('/admin/:itemid', function (req, res, next) {
  console.log(req.params.itemid);
  itemService.findOneItem(req.params.itemid, function(err, item, next) {
    if (err) {
      console.log(err);
    }
    if (item) {
      console.log(item);
      res.send(item);
    }
  });
});

module.exports = router;