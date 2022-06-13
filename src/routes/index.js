const express = require('express');
const path = require("path");

const rootDir = require('../helpers/path');
const router = express.Router();

// Should go in the end after all other use() calls
router.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'index.html'));
})

module.exports = router;
