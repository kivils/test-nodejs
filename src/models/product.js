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

  save() {
    readProductsFromFile(products => {
      const isProductExists = products.some(product => product.title === this.title);
      if(!isProductExists) {
        products.push(this);

        fs.writeFile(productsData, JSON.stringify(products), err => {
          console.log('Error saving product: ', err);
        });
      }
      else {
        console.log(['Product already exists'])
      }
    });
  };

  static fetchProducts(cb) {
    readProductsFromFile(cb);
  }

  static findById(id, cb) {
    readProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
