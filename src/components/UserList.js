const users = require('../data/users');

const UserList =
  '<ol>' +
  users.map((user) => {
    return '<li>' +user.name + '</p>'
  }).join('') +
  '</ol>'

module.exports = UserList;
