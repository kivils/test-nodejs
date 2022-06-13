const express = require('express');
const path = require('path');

const router = express.Router();

// in index.js these routes are prefixed with /users

// /users/create-user => POST
router.post('/create-user', (req, res) => {
  console.log(req.body);
  res.sendFile(path.join(__dirname, '../', 'views', 'create-user.html'));
})

// /users/create-user => GET
router.get('/create-user', (req, res) => {
  res.redirect('/');
})

// /users route
router.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'users.html'));
})

module.exports = router;
