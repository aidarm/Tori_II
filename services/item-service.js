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

exports.findItem = function(email, next) {
  Item.findOne({email: email.toLowerCase()}, function(err, user) {
    next(err, user);    
  });
};