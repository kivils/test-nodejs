const express = require('express');

const router = express.Router();

// Should go in the end after all other use() calls
router.get('/', (req, res) => {
  // res.render('index', { path: '/', pageTitle: 'Home page' }); // pug
  res.render('index', { pageTitle: 'Home page', activeMainPage: true }); // handlebars
})

module.exports = router;
