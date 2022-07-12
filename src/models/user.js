const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, username, email, cart, id) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.cart = cart; // { items: [], totalPrice: 0 }
    this._id = id;
  }

  save() {
    const db = getDb();

    return db
      .collection('users')
      .insertOne(this)
      .then(() => {
        return this._id;
      })
      .then(userId => {
        return db.collection('users')
          .find({ _id: userId })
          .next()
      })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  };

  addToCart(product) {
    let newQuantity = 1;
    const db = getDb();
    const cartProductIndex = this.cart.items.length ?
      this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
      }) : '-1';
    const updatedCartItems = [ ...this.cart.items ];

    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      })
    }

    const updatedCart = {
      items: updatedCartItems,
      totalPrice: Number(this.cart.totalPrice) + Number(product.price)
    };

    return db.collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCartItems() {
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId;
    })

    return db.collection('products')
      .find({
        _id: { $in: productIds }
      })
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(item => {
              return item.productId.toString() === product._id.toString()
            }).quantity
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  removeFromCart(product) {

  }

  static fetchAll() {
    return getDb().collection('users')
      .find()
      .toArray()
      .then(users => {
        return users;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchById(userId) {
    return getDb().collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  };
}

module.exports = User;
