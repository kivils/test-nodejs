const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.use('/shop/cart', shopController.getCart);

router.use('/shop/orders', shopController.getOrders);

// At the end
router.use('/shop', shopController.getProducts);

module.exports = router;
