const Product = require('../models/product');
const Cart = require('../models/cart');

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

  Product.findAll()
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

  Product.findByPk(productId)
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
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
          .then(products => {
            res.render('shop/cart', {
              pageTitle: 'Your shopping cart',
              path: '/shop/cart',
              cart: cart,
              products: products
            });
          })
          .catch(err => {
            console.log(err);
          })
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
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;

      if(products.length > 0) {
        product = products[0];
      }

      if(product) {
        // Increase quantity
        const oldQuantity = product.cartItem.quantity;

        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(productId);
    })
    .then(product => {
      return fetchedCart.addProduct(
        product,
        {
          through: {
            quantity: newQuantity
          }
        });
    })
    .then(() => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * Delete item on the Cart page
 * @param req
 * @param res
 */
exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  req.user
    .getCart()
    .then(cart=> {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];

      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      console.log(err);
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
