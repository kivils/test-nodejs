const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.post('/shop/cart', shopController.addPostCart);
router.get('/shop/cart', shopController.getCart);
router.post('/shop/delete-item-from-cart', shopController.postCartDeleteProduct);
router.post('/shop/update-item-in-cart', shopController.postUpdateAmountInCart);
// //
router.post('/shop/orders', shopController.postOrder);
router.get('/shop/orders', shopController.getOrders);
router.use('/shop/orders/:orderId', shopController.getOrder);

// // router.use('/shop/checkout', shopController.getCheckout);
//
router.use('/shop/:productId', shopController.getProduct);
//
router.use('/shop', shopController.getProducts);

module.exports = router;
