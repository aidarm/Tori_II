var express = require('express');
var router = express.Router();
var itemService = require("../services/item-service");

router.get('/create', function(req, res, next) {
  res.render('item/create', req.user);
  //console.log("bla!");
});

// router.post('/create', function(req, res, next) {
//   itemService.addItem(req.body, function(err) {
//     if (err) {
//       console.log(err);
//       var vm = {
//         title: 'Create an account',
//         input: req.body,
//         error: err
//       };
//       delete vm.input.password;
//       return res.render('item/create', vm);
//     }
//     res.send("IT WORKS!");
//     // req.login(req.body, function(err) {
//     //   res.redirect('/');
//     // });
//   });
// });

router.get('/view/:id', function(req, res, next) {
  res.render('index');;
});

router.get('admin/view/:id', function(req, res, next) {
  res.render('item/item');
});

router.post('/admin/view/:id', function (req, res, next) {
  console.log(req.params.id);
  itemService.findOneItem(req.params.id, function(err, item, next) {
    if (err) {
      console.log(err);
    }
    if (item) {
      console.log(item);
      res.send(item);
    }
  });
});

router.post('/view/:id', function (req, res, next) {
  console.log(req.params.id);
  itemService.findOneItem(req.params.id, function(err, item, next) {
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