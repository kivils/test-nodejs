const fs = require('fs');
const path = require('path');
const rootDir = require('../helpers/path');

const cartData = path.join(rootDir, 'data', 'cart.json');

const readCartDataFromFile = cb => {
  fs.readFile(cartData, (err, fileContent) => {
    if(err) {
      cb({ products: [], totalPrice: 0 });
    }
    else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch prev cart
    readCartDataFromFile(cart => {
      // Analyze the cart - find existing products
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // add new product or increase the quantity
      if(existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [ ...cart.products ];
        cart.products[existingProductIndex] = updatedProduct;
      }
      else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [ ...cart.products, updatedProduct ];
      }

      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);

      fs.writeFile(cartData, JSON.stringify(cart), err => {
        console.log('Add to cart error: ', err);
      })
    })
  }

  static deleteProduct(id, productPrice) {
    readCartDataFromFile(cart => {
      const updatedCart = { ...cart };
      const deletedProduct = cart.products.find(product => product.id === id);

      if(!deletedProduct) {
        return;
      }

      updatedCart.products = updatedCart.products.filter(product => product.id !== id);

      updatedCart.totalPrice = (Number(updatedCart.totalPrice) - Number(productPrice * deletedProduct.qty)).toFixed(2);

      fs.writeFile(cartData, JSON.stringify(updatedCart), err => {
        console.log('Remove from cart error: ', err);
      })
    });
  }

  static fetchCartItems(cb) {
    readCartDataFromFile(cb);
  }
}
