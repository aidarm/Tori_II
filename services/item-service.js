var Item = require('../models/item').Item;

exports.addItem = function(item, next) {
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

exports.findItem = function(next) {
  Item.find(function(err, item) {
    next(err, item);    
  });
};

exports.findOneItem = function(id, next) {
  Item.findOne({_id: id}, function(err, item) {
    next(err, item);    
  });
};