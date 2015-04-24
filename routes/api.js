var express = require('express');
var router = express.Router();
var passport = require('passport');
var restrict = require('../auth/restrict');
var itemService = require("../services/item-service");

router.get('/approve', restrict);
router.get('/reject', restrict);

router.post('/login', 
  passport.authenticate('local', {
    // failureRedirect: '/', 
    // successRedirect: '/'
  }),
  
  function(req, res, next) {
    res.send("DONE!");
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

router.post('/upload', restrict, function(req, res, next) {
  itemService.addItem(req.body, function(err) {
    if (err) {
      console.log(err);
      var vm = {
        title: 'Create an account',
        input: req.body,
        error: err
      };
      delete vm.input.password;
      return res.render('item/create', vm);
    }
    res.send("IT WORKS!");
    // req.login(req.body, function(err) {
    //   res.redirect('/');
    // });
  });
});

router.post('/update', function(req, res, next) {
  console.log(req.body);
  itemService.updateItem(req.body, function(err) {
    if (err) {
      console.log(err);
    }
    res.send("IT WORKS!");
    // req.login(req.body, function(err) {
    //   res.redirect('/');
    // });
  });
});

router.post('/approve', restrict, function(req, res, next) {
  console.log(req.body);
  console.log("!!!!!!");
  itemService.approveItem(req.body.id, function(err) {
    
    if (err) {
      console.log(err);
      var vm = {
        title: 'Create an account',
        input: req.body,
        error: err
      };
      delete vm.input.password;
      return res.render('item/create', vm);
    }
    res.send("IT WORKS!");
    // req.login(req.body, function(err) {
    //   res.redirect('/');
    // });
  });
});

router.post('/reject', restrict, function(req, res, next) {
  console.log(req.body);
  console.log("!!!!!!");
  itemService.rejectItem(req.body.id, function(err) {
    
    if (err) {
      console.log(err);
      var vm = {
        title: 'Create an account',
        input: req.body,
        error: err
      };
      delete vm.input.password;
      return res.render('item/create', vm);
    }
    res.send("IT WORKS!");
    // req.login(req.body, function(err) {
    //   res.redirect('/');
    // });
  });
});

module.exports = router;