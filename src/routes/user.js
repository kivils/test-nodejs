const express = require('express');
const path = require('path');

const rootDir = require('../helpers/path');
const router = express.Router();

// in index.js these routes are prefixed with /users

// /users/create-user => POST
router.post('/create-user', (req, res) => {
  console.log(req.body);
  res.sendFile(path.join(rootDir, 'views', 'create-user.html'));
})

// /users/create-user => GET
router.get('/create-user', (req, res) => {
  res.redirect('/');
})

// /users route
router.use('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'users.html'));
})

module.exports = router;
