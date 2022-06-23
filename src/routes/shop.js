const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.use('/shop', shopController.getProducts);

router.use('/cart', shopController.getCart);

module.exports = router;
