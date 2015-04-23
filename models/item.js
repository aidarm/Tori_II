var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  title: String,
  category: String,
  description: String,
  price: Number,
  name : String,
  city: String,
  phone: String,
  img: {type: String, default: "http://placehold.it/1000x700&text=TEST"}, // TODO: AZURE STORAGE
  approved: {type: Number, default: 0},
  created: {type: Date, default: Date.now}
});

var Item = mongoose.model('Item', itemSchema);

module.exports = {
  Item: Item
};