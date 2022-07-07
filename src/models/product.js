const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

class Product {
  constructor(title, description, imgUrl, price, id) {
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this.price = price;
    this._id = id;
  };

  save() {
    const db = getDb();
    let dbQueries;

    // Edit existing product
    if(this._id) {
      dbQueries = db
        .collection('products')
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) }, // FIX
          { $set: this }
        );
    }
    // Add new product
    else {
      dbQueries = db
        .collection('products')
        .insertOne(this)
    }

    return dbQueries
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  };

  static fetchAll() {
    const db = getDb();

    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  };

  static fetchById(prodId) {
    const db = getDb();

    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  };
}

module.exports = Product;
