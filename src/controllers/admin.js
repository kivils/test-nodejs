const { validationResult } = require('express-validator');
const fileHelper = require('../helpers/file');
const throw500 = require('../middleware/is-500');
const Product = require('../models/product');

const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;

/**
 * Product form: add and edit a product
 * @param req
 * @param res
 * @param next
 */
exports.getPostProduct = (req, res, next) => {
  const productId = req.params.productId;

  const renderPage = content => {
    res.render(
      'admin/post-product',
      {
        pageTitle: productId ? 'Edit product' : 'Add a new product',
        path: '/admin',
        product: content,
        submitted: false,
        successMessage: '',
        errorMessage: '',
        validationErrors: []
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
        throw500(err, next);
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
 * @param next
 */
exports.postPostProduct = (req, res, next) => {
  const {
    product_title,
    product_description,
    product_price,
    product_id
  } = req.body;
  const product_img = req.file;
  const errors = validationResult(req);
  const errorsMapped = errors.array().map(error => {
    return error.msg;
  });
  // TODO: FIX image placeholder in form on file upload
  const product_imgUrl = (product_img && product_img.path.replace('public', '') || '');

  const renderPage = (content) => {
    res.render(
      'admin/post-product',
      {
        pageTitle: (product_id ? 'Product updated: ': 'New product added: '),
        product: content,
        path: '/admin',
        submitted: true,
        successMessage: '',
        errorMessage: '',
        validationErrors: []
      }
    );
  }

  // TODO: Fix functionality!
  if(
    !errors.isEmpty() ||
    (!product_img && !product_id) // adding new product
  ) {
    if(!product_img) {
      errorsMapped.push('Allowed file extensions for "Product Image": png, jpg, jpeg')
    }
    return res.status(422)
      .render(
        'admin/post-product',
        {
          pageTitle: (product_id ? 'Error updating product': 'Error adding product'),
          path: '/admin',
          product: {
            _id: product_id || null, // Both for edit and add
            title: product_title,
            description: product_description,
            imgUrl: product_imgUrl,
            price: product_price,
          },
          submitted: false,
          successMessage: '',
          errorMessage: errorsMapped.join('; '),
          validationErrors: errors.array()
        }
      )
  }

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
        throw500(err, next);
      })
  }
  // Edit existing product
  else {
    Product
      .findById({ _id: product_id, userId: req.user._id })// mongoose provides this method
      .then(product => {
        product.title = product_title;
        product.description = product_description;
        product.imgUrl = product_imgUrl;
        product.price = product_price;

        fileHelper.fileDelete('public' + product.imgUrl); // Remove old image
        return product.save() // mongoose provides save method
      })
      .then(result => {
        renderPage(result);
      })
      .catch(err => {
        throw500(err, next);
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

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(result => {
      if(result.deletedCount === 0) {
        // flash format: ('error',  ['string1', 'string2', ...])
        req.flash('error', [ 'Product to delete is not found' ]);
        return res.redirect('/admin');
      }

      Product.find()
        .then(products => {
          // fileHelper.fileDelete('public' + product.imgUrl); // Remove an image
          res.status(200).json({ message: 'Product deleted' });
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Deleting product failed' });
    })
};

/**
 * Product list in admin area
 * @param req
 * @param res
 */
exports.getAdminProducts = (req, res) => {
  const currentPage = Number(req.query.page) || 1;
  let totalItems;
  // flash format: ('error',  ['string1', 'string2', ...])
  let errorMessage = req.flash('error');
  let successMessage = req.flash('success');

  if(errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  }
  else {
    errorMessage = null;
  }

  if(successMessage.length > 0) {
    successMessage = successMessage[0];
  }
  else {
    successMessage = null;
  }

  const renderPage = content => {
    res.render(
      'admin/products-list',
      {
        pageTitle: 'Admin area for our amazing shop',
        path: '/admin',
        products: content,
        errorMessage: errorMessage,
        successMessage: successMessage,
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
    .find({ userId: req.user._id }) // mongoose provides this method
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
 * Redirect if get directly to add product page
 * @param req
 * @param res
 */
exports.getAddProduct = (req, res) => {
  res.redirect('/');
}
