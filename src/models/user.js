const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    totalPrice: Number
  }
});

/**
 * Check cookies for loggedIn=true
 * @param req
 * @returns {*}
 */
userSchema.methods.isAuth = function(req) {
  return req.session.isLogged;
}

/**
 * Add product to cart
 * @param product
 * @returns {*}
 */
userSchema.methods.addToCart = function(product) {
  let newQuantity = 1;
  const cartProductIndex = this.cart.items.length ?
    this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    }) : '-1';
  const updatedCartItems = [ ...this.cart.items ];

  if(cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  }
  else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    })
  }

  this.cart = {
    items: updatedCartItems,
    totalPrice: Number(this.cart.totalPrice) + Number(product.price)
  };

  return this.save();
};

/**
 * Delete product from cart
 * @param productId
 * @returns {*}
 */
userSchema.methods.deleteFromCart = function(productId) {
  return this.populate('cart.items.productId')
    .then(user => {
      const updatedCartItems = this.cart.items.filter(item => {
        return item.productId._id.toString() !== productId.toString();
      });
      const deletedItem = user.cart.items.find(item => {
        return item.productId._id.toString() === productId.toString();
      });

      user.cart = {
        items: updatedCartItems,
        totalPrice: Number(this.cart.totalPrice) - (Number(deletedItem.productId.price) * Number(deletedItem.quantity))
      };
      return user.save();
    })
    .catch(err => {
      console.log(err);
    })
};

/**
 *
 * @param productId
 * @param increase
 * @returns {*}
 */
userSchema.methods.updateAmountInCart = function(productId, increase) {
  return this.populate('cart.items.productId')
    .then(user => {
      const cartProduct = this.cart.items.find(cp => {
        return cp.productId._id.toString() === productId.toString();
      });
      const updatedCartItems = [ ...user.cart.items ];
      const currentQuantity = cartProduct.quantity;

      const newQuantity = increase ?
        (currentQuantity + 1) :
        (currentQuantity - 1);

      const totalPrice = increase ?
        (Number(user.cart.totalPrice) + Number(cartProduct.productId.price)) :
        (Number(user.cart.totalPrice) - Number(cartProduct.productId.price));

      cartProduct.quantity = newQuantity;

      user.cart = totalPrice === 0 ? {
        items: [],
        totalPrice: 0
      } : {
        items: updatedCartItems,
        totalPrice: totalPrice
      }

      return user.save();
    })
    .catch(err => {
      console.log(err);
    })
};

/**
 * Clear cart
 * @returns {*}
 */
userSchema.methods.clearCart = function() {
  this.cart = {
    items: [],
    totalPrice: 0
  };

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
