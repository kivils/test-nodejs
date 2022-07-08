const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

class Product {
  constructor(title, description, imgUrl, price, id) {
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
  };

  save() {
    const db = getDb();
    let dbQueries;

    // Edit existing product
    if(this._id) {
      dbQueries = db
        .collection('products')
        .updateOne(
          { _id: this._id },
          // _id should not be passed to $set, as in this case mongodb also will try to update it
          // but _id is immutable
          // so in this case of editing product we can't use { $set: { this }}
          { $set: {
              title: this.title,
              description: this.description,
              imgUrl: this.imgUrl,
              price: this.price
            } }
        )
          .then(() => {
            return this._id
          })
      ;
    }
    // Add new product
    else {
      dbQueries = db
        .collection('products')
        .insertOne(this)
        .then(() => {
          return this._id;
        })
    }

    return dbQueries
      .then(prodId => {
        return db.collection('products')
          .find({ _id: prodId })
          .next()
      })
      .then(product => {
        return product;
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

  static deleteById(prodId) {
    const db = getDb();

    return this.fetchById(prodId)
      .then(product => {
        return product.title;
      })
      .then(title => {
        return db.collection('products')
          .deleteOne({ _id: new mongodb.ObjectId(prodId) })
          .then(() => {
            return title;
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
