const express = require('express');

const router = express.Router();

const usersList = require('../data/users');

/**
 * in index.js these routes are prefixed with /users
 */

// /users/create-user => POST
router.post('/create-user', (req, res) => {
  usersList.push({
    name: req.body.username
  });

  res.render(
    'create-user',
    {
      pageTitle: 'Create user',
      activeUsersPage: true,
      username: req.body.username
    }
  );
})

// /users/create-user => GET
router.get('/create-user', (req, res) => {
  res.redirect('/');
})

// /users route
router.use('/', (req, res) => {
  res.render('users', {
    pageTitle: 'Our people',
    users: usersList,
    hasUsers: usersList.length > 0,
    activeUsersPage: true
  });
})

module.exports = router;
