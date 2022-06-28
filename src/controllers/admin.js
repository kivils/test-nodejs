const Product = require('../models/product');

/**
 * Add a product
 * @param req
 * @param res
 */
exports.postAddProduct = (req, res) => {
  const {
    product_id,
    product_title,
    product_description,
    product_imgUrl,
    product_price
  } = req.body;

  const product = new Product(
    product_id,
    product_title,
    product_description,
    product_imgUrl,
    product_price
  );

  res.render(
      'admin/add-product',
      {
      pageTitle: 'New product added: ' + product_title,
      product: product,
      path: '/admin/add-product',
      editing: false
      }
  );

  product.save();
};

/**
 * Edit product: form with pre-populated values
 * @param req
 * @param res
 */
exports.getEditProduct = (req, res) => {
  const productId = req.params.productId;

  Product.findById(productId, product => {
    if(!product) {
      return res.redirect('/shop');
    }

    res.render(
      'admin/edit-product',
      {
        pageTitle: 'Update product: ' + product.title,
        path: '/admin/edit-product',
        product: product,
        editing: true
      }
    )
  });
};

/**
 * Post edit product
 * @param req
 * @param res
 */
exports.postEditProduct = (req, res) => {
  const {
    product_id,
    product_title,
    product_description,
    product_imgUrl,
    product_price
  } = req.body;

  const updatedProduct = new Product(
    product_id,
    product_title,
    product_description,
    product_imgUrl,
    product_price
  );

  updatedProduct.save();

  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Product ' + product_title + ' updated',
      product: updatedProduct,
      path: '/admin/edit-product',
      editing: true
    }
  );
};

/**
 * Delete product
 * @param req
 * @param res
 */
exports.getDeleteProduct = (req, res) => {
  const productId = req.params.productId;

  Product.deleteById(productId, title => {
    res.render(
      'admin/delete-product',
      {
        pageTitle: 'Product deleted',
        path: '/admin/delete-product',
        title: title
      }
    );
  });

};

/**
 * Product list in admin area
 * @param req
 * @param res
 */
exports.getAdminProducts = (req, res) => {
  Product.fetchProducts(products => {
    res.render(
      'admin/products-list',
      {
        pageTitle: 'Your admin area for our amazing shop',
        path: '/admin',
        products: products,
        editing: false
      }
    );
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
