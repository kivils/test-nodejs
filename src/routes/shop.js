const express = require('express');
const userForm = require('../components/userForm');

const router = express.Router();

// Should go in the end after all other use() calls
router.get('/', (req, res) => {
  res.send(
    '<h1>Hey, nice to see you!</h1>' +
    '<p>We have many greate people here, <a href="/users">just have a look</a>!</p>' +
    '<h2>Please join us :-)</h2>' +
    userForm
  );
})

module.exports = router;
