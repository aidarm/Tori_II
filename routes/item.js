var express = require('express');
var router = express.Router();
var itemService = require("../services/item-service");

router.get('/create', function(req, res, next) {
  res.render('item/create', req.user);
});

router.get('/view/:id', function(req, res, next) {
  res.render('item/item', req.user);
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