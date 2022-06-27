const Product = require('../models/product');

/**
 * Add a product
 * @param req
 * @param res
 */
exports.postAddProduct = (req, res) => {
  const id = req.body.product_id;
  const title = req.body.product_title;
  const description = req.body.product_description;
  const imgUrl = req.body.product_imgUrl;
  const price = req.body.product_price;
  const product = new Product(id, title, description, imgUrl, price);

  res.render(
      'admin/add-product',
      {
        pageTitle: 'New product added: ' + title,
        id: id,
        title: title,
        description: description,
        imgUrl: imgUrl,
        price: price,
        path: '/admin/add-product'
      }
  );

  product.save();
};

/**
 * Edit product
 * @param req
 * @param res
 */
exports.getEditProduct = (req, res) => {
  const id = req.body.product_id;
  const title = req.body.product_title;
  const description = req.body.product_description;
  const imgUrl = req.body.product_imgUrl;
  const price = req.body.product_price;
}

/**
 * Delete product
 * @param req
 * @param res
 */
exports.postDeleteProduct = (req, res) => {
  const id = req.body.product_id;
  const title = req.body.product_title;
  const description = req.body.product_description;
  const imgUrl = req.body.product_imgUrl;
  const price = req.body.product_price;
}

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
