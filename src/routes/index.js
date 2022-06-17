const express = require('express');

const router = express.Router();

// Should go in the end after all other use() calls
router.get('/', (req, res) => {
  /**
   * PUG
   */
  // res.render('index', { path: '/', pageTitle: 'Home page' });

  /**
   * HANDLEBARS
   */
  // res.render('index', { pageTitle: 'Home page', activeMainPage: true });

  /**
   * EJS
   */
  res.render('index', { path: '/', pageTitle: 'Home page' });
})

module.exports = router;
