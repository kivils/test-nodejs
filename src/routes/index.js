const express = require('express');
const mainController = require('../controllers/main');

const router = express.Router();

// Should go in the end after all other use() calls
router.get('/', mainController.getMainPage);

module.exports = router;
