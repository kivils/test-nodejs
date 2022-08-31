const express = require('express');

const router = express.Router();

const isLogged = require('../middleware/is-logged');
const shopController = require('../controllers/shop');

router.post('/shop/cart', isLogged, shopController.addPostCart);
router.get('/shop/cart', isLogged, shopController.getCart);
router.post('/shop/delete-item-from-cart', isLogged, shopController.postCartDeleteProduct);
router.post('/shop/update-item-in-cart', isLogged, shopController.postUpdateAmountInCart);

router.get('/shop/orders', isLogged, shopController.getOrders);
router.use('/shop/orders/invoices/:orderId', isLogged, shopController.getInvoice);
router.use('/shop/orders/:orderId', isLogged, shopController.getOrder);

router.get('/shop/checkout/success', isLogged, shopController.getCheckoutSuccess);
router.get('/shop/checkout/cancel', isLogged, shopController.getCheckout);
router.use('/shop/checkout', isLogged, shopController.getCheckout);

router.use('/shop/:productId', shopController.getProduct);

router.use('/shop', shopController.getProducts);

module.exports = router;
