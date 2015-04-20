var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/cat/cars', function(req, res, next) {
  res.render('item/cat');
  //console.log("bla!");
});

router.get('/cat/houses', function(req, res, next) {
  res.render('item/cat');
  //console.log("bla!");
});


module.exports = router;
