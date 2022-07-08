const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

router.get('/admin/post-product/:productId', productController.getPostProduct);
router.get('/admin/post-product/', productController.getPostProduct);

router.post('/admin/post-product', productController.postPostProduct);

router.get('/admin/delete-product/:productId', productController.getDeleteProduct);

router.use('/admin', productController.getAdminProducts);

module.exports = router;
