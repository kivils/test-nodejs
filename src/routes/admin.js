const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

router.get('/admin/edit-product/:productId', productController.getEditProduct);

router.post('/admin/add-product', productController.postAddProduct);
router.get('/admin/add-product', productController.getAddProduct);

router.post('/admin', productController.postDeleteProduct);

router.use('/admin', productController.getAdminProducts);

module.exports = router;
