const Product = require('../models/product');

/**
 * Product form: add and edit a product
 * @param req
 * @param res
 */
exports.getPostProduct = (req, res) => {
  const productId = req.params.productId;

  // Editing an existing product
  if(productId) {
    Product.findById(productId, product => {
      if(!product) {
        return res.redirect('/admin');
      }

      res.render(
        'admin/post-product',
        {
          pageTitle: 'Edit product: ',
          path: '/admin',
          product: product,
          submitted: false
        }
      )
    });
  }

  // Adding a new product
  else {
    res.render(
      'admin/post-product',
      {
        pageTitle: 'Add a new product',
        path: '/admin',
        product: null,
        submitted: false
      }
    )
  }
};

/**
 * Product form submission: adding and editing a product
 * @param req
 * @param res
 */
exports.postPostProduct = (req, res) => {
  const {
    product_id,
    product_title,
    product_description,
    product_imgUrl,
    product_price,
    editing
  } = req.body;

  const product = new Product(
      product_id,
      product_title,
      product_description,
      product_imgUrl,
      product_price
  );

  product.save()
    .then(() => {
      res.render(
          'admin/post-product',
          {
            pageTitle: (editing ? 'Product updated: ': 'New product added: '),
            product: product,
            path: '/admin',
            submitted: true
          }
      );
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * Delete product
 * @param req
 * @param res
 */
exports.getDeleteProduct = (req, res) => {
  const productId = req.params.productId;

  Product.deleteById(productId, title => {
    if(title) {
      res.render(
        'admin/delete-product',
        {
          pageTitle: 'Product deleted: ',
          path: '/admin/delete-product',
          title: title
        }
      );
    }
    else {
      res.redirect('/admin')
    }
  });
};

/**
 * Product list in admin area
 * @param req
 * @param res
 */
exports.getAdminProducts = (req, res) => {
  Product.fetchProducts()
    .then(([ rows ]) => {
      res.render(
        'admin/products-list',
        {
          pageTitle: 'Your admin area for our amazing shop',
          path: '/admin',
          products: rows
        }
      );
    })
    .catch(err => {
      console.log(err)
    })
};

/**
 * Redirect if come directly to add product page
 * @param req
 * @param res
 */
exports.getAddProduct = (req, res) => {
  res.redirect('/');
}
