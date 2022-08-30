const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;

/**
 * List of all products
 * @param req
 * @param res
 */
exports.getProducts = (req, res) => {
  const currentPage = Number(req.query.page) || 1;
  let totalItems;

  const renderPage = content => {
    res.render(
      'shop/products',
      {
        pageTitle: 'Our amazing shop',
        path: '/shop',
        products: content,
        pagination: {
          totalItems: totalItems,
          currentPage: currentPage,
          totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
          prevPage: currentPage - 1,
          nextPage: currentPage + 1,
          hasPrevPage: currentPage > 1,
          hasNextPage: ITEMS_PER_PAGE * currentPage < totalItems
        }
      }
    );
  };

  Product
    .find()// mongoose method
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Product
          .find()
          .skip((currentPage - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
      })
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
        },
        date: Date.now()
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

/**
 * Download pdf invoice for an order
 * @param req
 * @param res
 * @param next
 */
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if(!order) {
        return next(new Error('No order found'));
      }

      if(order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('private', 'orders', invoiceName);

      const pdfDoc = new PDFDocument;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.text('Your invoice', {
        underline: true
      });
      pdfDoc.text('----');
      order.items.map(item => {
        pdfDoc.text(item.productId.title + ' x ' + item.quantity + ' = $' + item.productId.price);
      })
      pdfDoc.text('----');
      pdfDoc.text('Total price: ' + order.totalPrice);
      pdfDoc.end();
    })
    .catch(err => {
      console.log(err);
    })

};
