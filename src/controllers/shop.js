const Product = require('../models/product');
const Order = require('../models/order');

/**
 * List of all products
 * @param req
 * @param res
 */
exports.getProducts = (req, res) => {
  const renderPage = content => {
    res.render(
      'shop/products',
      {
        pageTitle: 'Our amazing shop',
        path: '/shop',
        products: content
      }
    );
  };

  Product
    .find()// mongoose method
    .then( products => {
      renderPage(products);
    })
    .catch(err => {
      console.log(err);
      renderPage({});
    });
};

/**
 * Product page
 * @param req
 * @param res
 */
exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  const renderPage = content => {
    res.render(
      'shop/product-card',
      {
        pageTitle: content.title || 'Product doesn\'t exist',
        path: '/shop',
        product: content
      }
    );
  };

  Product.findById(productId)
    .then(product => {
      renderPage(product);
    })
    .catch(err => {
      console.log(err);
      renderPage(false);
    });
};

/**
 * Product cart
 * @param req
 * @param res
 */
exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Your shopping cart',
        path: '/shop/cart',
        cart: user.cart,
        products: user.cart.items
      });
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Add to cart by POST
 * @param req
 * @param res
 */
exports.addPostCart = (req, res) => {
  const productId = req.body.product_id;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      console.log(err);
    })
};

/**
 * Delete item on the Cart page
 * @param req
 * @param res
 */
exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  req.user
    .deleteFromCart(productId)
    .then(() => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * Update amount of products in the cart
 * @param req
 * @param res
 */
exports.postUpdateAmountInCart = (req, res) => {
  const productId = req.body.productId;
  const increase = req.body.increase;

  req.user
    .updateAmountInCart(productId, increase)
    .then(() => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      console.log(err);
    })
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
};

/**
 * Add cart to Order (POST request)
 * @param req
 * @param res
 */
exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          productId: { ...item.productId._doc },
          quantity: item.quantity
        }
      })
      const order = new Order({
        items: products,
        totalPrice: user.cart.totalPrice,
        user: {
          userId: user._id,
          name: user.name
        }
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/shop/orders');
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Orders page
 * @param req
 * @param res
 */
exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your orders',
        path: '/shop/orders',
        orders: orders
      });
    })
    .catch( err => {
      console.log(err);
    });
};

/**
 * Get all orders for the user
 * @param req
 * @param res
 */
exports.getOrder = (req, res) => {
  const orderId = req.params.orderId;

  Order.findOne({ '_id': orderId })
    .then(order => {
      res.render('shop/order-card', {
        pageTitle: 'Order',
        path: '/shop/order',
        order: order
      });
    })
    .catch(err => {
      console.log(err);
    });
};
