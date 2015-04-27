var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  title: {type: String, required: true},
  category: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  name : {type: String, required: true},
  city: {type: String, required: true},
  phone: {type: String, required: true},
  img: {type: Array, required: true},
  approved: {type: Number, default: 0},
  created: {type: Date, default: Date.now}
});

var Item = mongoose.model('Item', itemSchema);

module.exports = {
  Item: Item
};