const fs = require('fs');
const path = require('path');
const rootDir = require('../helpers/path');

const usersData = path.join(rootDir, 'data', 'users.json');

module.exports = class User  {
  constructor(name) {
    this.name = name;
  };

  save() {
    fs.readFile(usersData, (err, fileContent) => {
      let users = [];
      if(!err) {
        users = JSON.parse(fileContent);
      }

      users.push(this);

      fs.writeFile(usersData, JSON.stringify(users), err => {
        console.log('Error: ', err);
      });
    });
  };

  static fetchAll(cb) {
    fs.readFile(usersData, (err, fileContent) => {
      if(err) {
        cb([]);
      }
      else {
        cb(JSON.parse(fileContent));
      }
    });
  }
}
