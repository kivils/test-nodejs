const fs = require('fs');
const path = require('path');
const rootDir = require('../helpers/path');

const productsData = path.join(rootDir, 'data', 'products.json');

const readProductsFromFile = cb => {
  fs.readFile(productsData, (err, fileContent) => {
    if(err) {
      cb([]);
    }
    else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, description, imgUrl, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this.price = price;
  };

  /**
   * Add new product and update existing product
   */
  save() {
    readProductsFromFile(products => {
      const existingProductIndex = products.find(product => product.id === this.id);

      // if product exists - edit product
      if(existingProductIndex) {
        const updatedProducts = [ ...products ];

        updatedProducts[existingProductIndex] = this;

        fs.writeFile(productsData, JSON.stringify(updatedProducts), err => {
          console.log('Error saving product: ', err);
        });
      }
      // Add a new product
      else {
        products.push(this);

        fs.writeFile(productsData, JSON.stringify(products), err => {
          console.log('Error saving product: ', err);
        });
      }
    });
  };

  /**
   * Delete product
   */
  static deleteById(id, cb) {
    readProductsFromFile(products => {
      const deletedProduct = products.find(product => product.id === id);
      const deletedTitle = deletedProduct.title;
      const updatedProducts = products.filter(product => product.id !== id);

      fs.writeFile(productsData, JSON.stringify(updatedProducts), err => {
        console.log('Error deleting product: ', err);
      });

      cb(deletedTitle);
    });
  };

  static fetchProducts(cb) {
    readProductsFromFile(cb);
  };

  static findById(id, cb) {
    readProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  };
};
