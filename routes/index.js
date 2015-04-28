var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

// PROTECTED ROUTES

router.get('/list/user/:page', restrict);

// router.post('/admin', function(req, res, next) {
//   console.log(req.body);
//   itemService.findItem(0, null, function(err, item, next) {
//     if (err) {
//       console.log(err);
//     }
//     if (item) {
//       res.send(item);
//     }
//   });
// });

// router.get('/cat/:cat', function(req, res, next) {

//   var query = req.params.cat;
//   var data = {};
  
//   itemService.findItem(1, query, function(err, item, next) {
//     if (err) {
//       console.log(err);
//     }
//     if (item) {
//       data.item = item;
//       res.render('admin', data);
//     }
//   });
  
  
// });

// router.get('/admin', function(req, res, next) {

//   var data = {};
  
//   itemService.findItem(0, null, function(err, item, next) {
//     if (err) {
//       console.log(err);
//     }
//     if (item) {
//       data.item = item;
//       res.render('index', data);
//     }
//   });
// });

//THSI SHIT
// router.get('/admin/:itemid', restrict, function(req, res, next) {
//   res.render('item/item', req.user);
// });

// router.post('/admin/:itemid', restrict, function (req, res, next) {
//   console.log(req.params.itemid);
//   itemService.findOneItem(req.params.itemid, function(err, item, next) {
//     if (err) {
//       console.log(err);
//     }
//     if (item) {
//       console.log(item);
//       res.send(item);
//     }
//   });
// });

module.exports = router;