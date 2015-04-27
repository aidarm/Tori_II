var Item = require('../models/item').Item;

exports.newItem = function(item, next) {
  var newItem = new Item({
    title: item.title,
    category: item.category,
    description: item.description,
    price: item.price,
    name: item.name,
    city: item.city,
    phone: item.phone,
    img: item.img
  });
  
  newItem.save(function(err) {
    if (err) {
      return next(err);
    }
    next(null);
  });
};

exports.findList = function(appr, list, page, next) {
  var query = {};
  query.approved = appr;
  var pages = 25*page;
  if (list != null) {
    query.category = list;
  }
  Item.find(query).skip(pages).sort({_id:-1}).limit(25).exec(function(err, item) {
    next(err, item);    
  });
};

exports.countList = function(appr, list, next) {
  var query = {};
  query.approved = appr;
  if (list != null) {
    query.category = list;
  }
  Item.find(query).count().exec(function(err, item) {
    next(err, item);    
  });
};

exports.findItem = function(id, next) {
  Item.findOne({_id: id}, function(err, item) {
    next(err, item);    
  });
};

exports.approveItem = function(id, next) {
  Item.update({_id: id}, {$set: {approved: 1}}, function(err, item) {
    next(err, item);    
  });
};

exports.deleteItem = function(id, next) {
  Item.remove({_id: id}, function(err, item) {
    next(err, item);    
  });
};

exports.updateItem = function(obj, next) {
  Item.update({_id: obj._id}, {$set: {
    title: obj.title,
    category: obj.category,
    description: obj.description,
    price: obj.price,
    name: obj.name,
    city: obj.city,
    phone: obj.phone,
    img: obj.img
  }}, function(err, item) {
    next(err, item);    
  });
};