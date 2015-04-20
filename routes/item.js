var express = require('express');
var router = express.Router();
var userService = require("../services/item-service");

router.get('/create', function(req, res, next) {
  res.render('item/create');
  //console.log("bla!");
});

router.post('/create', function(req, res, next) {
  userService.addItem(req.body, function(err) {
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