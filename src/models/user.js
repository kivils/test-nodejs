const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

class User {
  constructor(name, username, email) {
    this.name = name;
    this.username = username;
    this.email = email;
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
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  };
};

module.exports = User;
