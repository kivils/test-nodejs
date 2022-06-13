const express = require('express');
const path = require("path");

const router = express.Router();

// Should go in the end after all other use() calls
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
})

module.exports = router;
