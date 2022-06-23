const Product = require('../models/product');

const cart = [];

/**
 * List of all products
 * @param req
 * @param res
 */
exports.getProducts = (req, res) => {
  Product.fetchProducts(products => {
    res.render(
      'shop/products',
      {
        pageTitle: 'Our amazing shop',
        path: '/shop',
        products: products
      }
    );
  });
};

/**
 * Product cart
 * @param req
 * @param res
 */
exports.getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Your shopping cart',
    items: cart,
    path: '/cart'
  });
}

/**
 * Checkout page
 * @param req
 * @param res
 */
exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'You are one step away from having pour amazing products!',
    path: '/checkout'
  });
}
