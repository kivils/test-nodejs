const Product = require('../models/product');

/**
 * Product form: add and edit a product
 * @param req
 * @param res
 */
exports.getPostProduct = (req, res) => {
  const productId = req.params.productId;

  const renderPage = content => {
    res.render(
      'admin/post-product',
      {
        pageTitle: productId ? 'Edit product' : 'Add a new product',
        path: '/admin',
        product: content,
        submitted: false
      }
    );
  };

  // Editing an existing product
  if(productId) {
    Product.findById(productId)
      .then(product => {
        if(!product) {
          return res.redirect('/admin');
        }

        renderPage(product);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Adding a new product
  else {
    renderPage(null);
  }
};

/**
 * Product form submission: adding and editing a product
 * @param req
 * @param res
 */
exports.postPostProduct = (req, res) => {
  const {
    product_title,
    product_description,
    product_imgUrl,
    product_price,
    product_id
  } = req.body;

  const renderPage = (content) => {
    res.render(
      'admin/post-product',
      {
        pageTitle: (product_id ? 'Product updated: ': 'New product added: '),
        product: content,
        path: '/admin',
        submitted: true
      }
    );
  }

  // TODO: Check if product with the same title exists and show error
  // Add a new product
  if(!product_id) {
    const product = new Product({
      title: product_title,
      description: product_description,
      imgUrl: product_imgUrl,
      price: product_price,
      userId: req.user
    });

    product
      .save() // mongoose provides save method
      .then(result => {
        renderPage(result, false);
      })
      .catch(err => {
        console.log(err);
      })
  }
  // Edit existing product
  else {
    Product
      .findById(product_id)// mongoose provides this method
      .then(product => {
        product.title = product_title;
        product.description = product_description;
        product.imgUrl = product_imgUrl;
        product.price = product_price;

        return product.save() // mongoose provides save method
      })
      .then(result => {
        renderPage(result);
      })
      .catch(err => {
        console.log(err);
      })
      .catch(err => {
        console.log(err);
      })
  }
}

/**
 * Delete product
 * @param req
 * @param res
 */
exports.getDeleteProduct = (req, res) => {
  const productId = req.params.productId;

  Product.findByIdAndDelete(productId)
    .then(product => {
      return product;
    })
    .then(result => {
      Product.find().then(products => {
        res.render(
          'admin/delete-product',
          {
            pageTitle: 'Product deleted: ',
            path: '/admin/delete-product',
            title: result ? result.title : '',
            products: products
          }
        );
    })
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin');
    })
};

/**
 * Product list in admin area
 * @param req
 * @param res
 */
exports.getAdminProducts = (req, res) => {
  const renderPage = content => {
    res.render(
      'admin/products-list',
      {
        pageTitle: 'Admin area for our amazing shop',
        path: '/admin',
        products: content
      }
    );
  };

  Product
    .find() // mongoose provides this method
    .then( products => {
      renderPage(products);
    })
    .catch(err => {
      console.log(err);
      renderPage({});
    });
};

/**
 * Redirect if get directly to add product page
 * @param req
 * @param res
 */
exports.getAddProduct = (req, res) => {
  res.redirect('/');
}
