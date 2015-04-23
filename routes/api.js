var express = require('express');
var router = express.Router();
var passport = require('passport');
var itemService = require("../services/item-service");

router.post('/login', 
  passport.authenticate('local', {
    // failureRedirect: '/', 
    // successRedirect: '/'
  }),
  
  function(req, res, next) {
    res.send("DONE!");
});

router.get('/logout', function(req, res, next) {
  req.logout();
  //req.session.destroy();
  res.redirect('/');
});

router.post('/upload', function(req, res, next) {
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

module.exports = router;