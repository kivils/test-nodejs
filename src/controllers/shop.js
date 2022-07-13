const Product = require('../models/product');

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

  Product.fetchAll()
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

  Product.fetchById(productId)
    .then(product => {
      renderPage(product);
    })
    .catch(err => {
      console.log(err);
      renderPage(false);
    });

    // Another approach with findAll (return an array with 1 element)
    // Product.findAll({
    //   where: { id: productId }
    // })
    //   .then(products => {
    //     renderPage(products[0]);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     renderPage(false);
    //   })
};

/**
 * Product cart
 * @param req
 * @param res
 */
exports.getCart = (req, res) => {
  req.user.getCartItems()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your shopping cart',
        path: '/shop/cart',
        cart: req.user.cart,
        products: products
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

  Product.fetchById(productId)
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
 */
exports.postOrder = (req, res) => {
  let fetchedCart;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;

      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder({ totalPrice: fetchedCart.totalPrice })
        .then(order => {

          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(() => {
      fetchedCart.update({ totalPrice: 0 });

      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/shop/checkout');
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
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      let itemTotalPrice = 0;

      orders.map(order => {
        order.products.map(product => {
          itemTotalPrice = itemTotalPrice + (product.price * product.orderItem.quantity);
        })
      });

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

exports.getOrder = (req, res) => {
  const orderId = req.params.orderId;

  req.user
    .getOrders()
    .then(orders => {
      const order = orders[orderId]
      res.render('shop/order-card', {
        pageTitle: 'Order',
        path: '/shop/order',
        order: order
      });
    })
    .catch(err => {
      console.log(err);
    })
};
