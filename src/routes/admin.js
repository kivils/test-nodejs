const express = require('express');

const router = express.Router();

const isLogged = require('../middleware/is-logged');
const productController = require('../controllers/admin');

router.get('/admin/post-product/:productId', isLogged, productController.getPostProduct);
router.get('/admin/post-product/', isLogged, productController.getPostProduct);

router.post('/admin/post-product', isLogged, productController.postPostProduct);

router.get('/admin/delete-product/:productId', isLogged, productController.getDeleteProduct);

router.use('/admin', isLogged, productController.getAdminProducts);

module.exports = router;
