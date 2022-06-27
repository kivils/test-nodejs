const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    res.render(
        'shop/product-card',
        {
          pageTitle: product.title,
          path: '/shop',
          product: product
        }
    );
  });
}

/**
 * Product cart
 * @param req
 * @param res
 */
exports.getCart = (req, res) => {
  Cart.fetchCartItems(cart => {
      res.render('shop/cart', {
        pageTitle: 'Your shopping cart',
        cart: cart,
        path: '/shop/cart'
      });
  });
}

/**
 * Add to cart by POST
 * @param req
 * @param res
 */
exports.addPostCart = (req, res) => {
  const productId = req.body.product_id;

  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);

    // TODO: Fix: Add callback
    Cart.fetchCartItems(cart => {
      res.render('shop/cart', {
        pageTitle: 'Your shopping cart',
        cart: cart,
        path: '/shop/cart'
      });
    });
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
    path: '/shop/checkout'
  });
}

/**
 * Orders page
 * @param req
 * @param res
 */
exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Your orders',
    path: '/shop/orders'
  });
}
