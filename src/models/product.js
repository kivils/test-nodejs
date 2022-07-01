const db = require('../helpers/database');

const Cart = require('./cart');

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
    return db.execute(
        'INSERT INTO products (title, description, imgUrl, price) VALUES (? ,? ,?, ?)',
      [ this.title, this.description, this.imgUrl, this.price ]
    );
  };

  /**
   * Delete product
   */
  static deleteById(id) {

  };

  /**
   * Fetch all products
   */
  static fetchProducts() {
    return db.execute('SELECT * FROM products');
  };

  /**
   * Find product by id
   * @param id
   */
  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [ id ]);
  };
};
