const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

router.post('/admin/add-product', productController.postAddProduct);

router.get('/admin/add-product', productController.getAddProduct);

router.get('/admin/edit-product', productController.getEditProduct);

router.post('/admin', productController.postDeleteProduct);

router.use('/admin', productController.getAdminProducts);

module.exports = router;
