var express = require('express');
var router = express.Router();
var passport = require('passport');
var restrict = require('../auth/restrict');
var itemService = require("../services/item-service");
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var simple_recaptcha = require('simple-recaptcha');

process.env['AZURE_STORAGE_ACCOUNT'] = 'tori';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'LIG32cEO2UKFrX5CVQVN22+l3P52zhqW9TDffd8McvApbjWYS6Scaw6wbO04WsstOk2sYubOzVJ00++ufIiRfQ==';

var azure = require('azure-storage');
var blobService = azure.createBlobService();

/* ----------------------------------- Protected Routes ----------------------------------- */

router.get('/approve', restrict);
router.get('/reject', restrict);

/* ---------------------------------- Database Management --------------------------------- */

router.get('/data', function(req, res, next) {
  
  var data = {};
  data.user = req.user;
  
  var appr = req.query.appr;
  var list = req.query.list;
  var single = req.query.single;
  var page = req.query.page;
  var id = req.query.id;

  if (single == "true") {
    itemService.findItem(id, function(err, item, next) {
      if (err) {
        console.log(err);
        return res.status(404).end()
      }
      if (item) {
        if (item.approved != 1 && !req.isAuthenticated()) return res.status(404).end();
          data.data = item;
          res.json(data);
        }
      }
    );
  } else {
    itemService.countList(appr, list, function(err, count, next) {
      if (err) {
        console.log(err);
      }
      if (count) {
        data.count = count;
      }
    });
    itemService.findList(appr, list, page, function(err, item, next) {
      if (err) {
        console.log(err);
        return res.status(404).end()
      }
      if (item) {
        if (item.length == 0 || (appr != 1 && !req.isAuthenticated())) return res.status(404).end();
        data.data = item;
        res.json(data);
      }
    });
  }

});

router.post('/data', multipartyMiddleware, function(req, res, next) {
  //console.log(req.body);
  // var files = req.files.file;
  // for (var i in files) {
  //   console.log(files[i].path);
  //   console.log(files[i].size);
  //   var randName = Date.now();
  //   console.log("rand good");
  //   blobService.createBlockBlobFromLocalFile('images', randName, files[i].path, files[i].size, function(err) {
  //   if (!err) {
  //     //res.send(true);
  //     console.log("DONE!");
  //   }
  //   console.log("blob not good");
  // })}
  
  // var title = req.body.title;
  // var randName = title.replace(/ /g, "") + Date.now();
  // console.log(req.files.file);
  // var filename = "https://tori.blob.core.windows.net/images/" + randName;
  // req.body.img = filename;
  // blobService.createBlockBlobFromLocalFile('images', randName, req.files.file.path, req.files.file.size, function(err) {
  //   if (!err) {
  //     res.send(true);
  //   }
  // });
  
  itemService.newItem(req.body, function(err) {
    if (err) {
      console.log(err);
    }
  });

});

router.post('/image', multipartyMiddleware, function(req, res, next) {
  blobService.createBlockBlobFromLocalFile('images', req.body.rando, req.files.file.path, req.files.file.size, function(err) {
    if (!err) {
      console.log("YEAH!");
    }
  });
});

router.post('/update', function(req, res, next) {
  console.log(req.body);
  itemService.updateItem(req.body, function(err) {
    if (err) {
      console.log(err);
    }
    res.send(true);
  });
});

router.post('/approve', restrict, function(req, res, next) {
  itemService.approveItem(req.body.id, function(err) {
    if (err) {
      console.log(err);
    }
    res.send(true);
  });
});

router.post('/delete', restrict, function(req, res, next) {
  itemService.deleteItem(req.body.id, function(err) {
    if (err) {
      console.log(err);
    }
    res.send(true);
  });
});

/* ----------------------------------- Session Management ---------------------------------- */

router.post('/signin', passport.authenticate('local', {}), function(req, res, next) {
    res.send(true);
});

router.get('/signout', function(req, res, next) {
  req.session.destroy();
  req.logout();
  res.send(true);
});

module.exports = router;