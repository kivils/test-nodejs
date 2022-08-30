const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const isLogged = require('../middleware/is-logged');
const productController = require('../controllers/admin');
const Product = require('../models/product');

router.get('/admin/post-product/:productId', isLogged, productController.getPostProduct);
router.get('/admin/post-product/', isLogged, productController.getPostProduct);

router.post(
  '/admin/post-product',
  isLogged,
  body('product_title')
    .isLength({ min: 3, max: 100 })
    .trim()
    .withMessage('Product title should be of 3 to 100 characters')
    .custom((value, { req }) => {
      return Product.findOne({ 'title': value })
        .then(product => {
          if(product && (!req.body.product_id)) { // Only for adding product
            return Promise.reject('Product with this title already exists');
          }
        })
  }),
  body('product_description')
    .isLength({ min: 8, max: 1000 })
    .trim()
    .withMessage('Product description should be of 8 to 1000 characters'),
    body('product_price')
    .trim()
    .isFloat(),
  productController.postPostProduct
);

router.delete('/admin/product/:productId', isLogged, productController.getDeleteProduct);

router.use('/admin', isLogged, productController.getAdminProducts);

module.exports = router;
