const Product = require('../models/product');
const Cart = require('../models/cart');

/**
 * List of all products
 * @param req
 * @param res
 */
exports.getProducts = (req, res) => {
  Product.fetchProducts()
    .then(([ rows ]) => {
      res.render(
        'shop/products',
        {
          pageTitle: 'Our amazing shop',
          path: '/shop',
          products: rows
        }
      );
    })
    .catch(err => {
      console.log(err);
    })
};

/**
 * Product page
 * @param req
 * @param res
 */
exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  if(productId) {
    Product.findById(productId)
      .then(([ product ]) => {
        res.render(
          'shop/product-card',
          {
            pageTitle: product[0].title,
            path: '/shop',
            product: product[0]
          }
        );
      })
      .catch(err => {
        console.log(err);
      })
  }
  else {
    res.redirect('/shop');
  }
};

/**
 * Product cart
 * @param req
 * @param res
 */
exports.getCart = (req, res) => {
  Cart.fetchCartItems(cart => {
    Product.fetchProducts(products =>{
      const cartProducts = [];

      products.map(product => {
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if(cartProductData) {
          cartProducts.push({ productsData: product, productQty: cartProductData.qty })
        }
      });

      res.render('shop/cart', {
        pageTitle: 'Your shopping cart',
        cart: cart,
        path: '/shop/cart',
        products: cartProducts
      });
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

    res.redirect('/shop/cart');
  });
}

/**
 * Delete item on the Cart page
 * @param req
 * @param res
 */
exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId, product => {
    Cart.deleteProduct(product.id, product.price);

    res.redirect('/shop/cart');
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
