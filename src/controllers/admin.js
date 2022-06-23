const Product = require('../models/product');

/**
 * Add a product
 * @param req
 * @param res
 */
exports.postAddProduct = (req, res) => {
  const title = req.body.product_title;
  const product = new Product(title);

  res.render(
      'admin/add-product',
      {
        pageTitle: 'New product added: ' + title,
        title: title,
        path: '/admin/add-product'
      }
  );

  product.save();
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
          products: products
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
