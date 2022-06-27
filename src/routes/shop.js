const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.post('/shop/cart', shopController.addPostCart);
router.get('/shop/cart', shopController.getCart);

router.use('/shop/orders', shopController.getOrders);

router.use('/shop/:productId', shopController.getProduct);

router.use('/shop', shopController.getProducts);

module.exports = router;
