const usersList = require('../data/users');

module.exports = class Product  {
  constructor(name) {
    this.name = name;
  }

  save() {
    usersList.push(this);
  }

  static fetchAll() {
    return usersList;
  }
}
