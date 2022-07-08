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
    Product.fetchById(productId)
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

  const product = new Product(
    product_title,
    product_description,
    product_imgUrl,
    product_price,
    product_id
  );

  product.save()
    .then(result => {
      renderPage(result);
    })
    .catch(err => {
      console.log(err);
    })
}

/**
 * Delete product
 * @param req
 * @param res
 */
exports.getDeleteProduct = (req, res) => {
  const productId = req.params.productId;

  Product.deleteById(productId)
    .then(title => {
      res.render(
        'admin/delete-product',
        {
          pageTitle: 'Product deleted: ',
          path: '/admin/delete-product',
          title: title
        }
      );
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
        pageTitle: 'Your admin area for our amazing shop',
        path: '/admin',
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
 * Redirect if come directly to add product page
 * @param req
 * @param res
 */
exports.getAddProduct = (req, res) => {
  res.redirect('/');
}
