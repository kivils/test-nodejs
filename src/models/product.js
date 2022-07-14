const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  imgUrl: {
    type: String
  },
  price: {
    type: Number,
    require: true
  }
});

module.exports = mongoose.model('Product', productSchema);
