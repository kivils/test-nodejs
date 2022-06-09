const express = require('express');
const userForm = require('../components/UserForm');
const userList = require('../components/UserList')

const router = express.Router();

// in index.js these routes are prefixed with /users

// /users/create-user => POST
router.post('/create-user', (req, res) => {
  console.log(req.body);
  res.send('' +
    '<p><a href="/">Our home page</a></p>' +
    '<h1>Wow <span style="color: green;">' + req.body.username + '</span>! Welcome to the club :-) !</h1>' +
    '<p>Now you are <a href="/users">one of us</a>!</p>'
  );
})

// /users/create-user => GET
router.get('/create-user', (req, res) => {
  res.redirect('/');
})

// /users route
router.use('/', (req, res) => {
  res.send(
    '<p><a href="/">Our home page</a></p>' +
    '<h1>Our people</h1>' +
    '<p>We have many greate people here, just have a look!</p>' +
    userList +
    '<h2>Please join us :-)</h2>' +
    userForm
  );
})

module.exports = router;
