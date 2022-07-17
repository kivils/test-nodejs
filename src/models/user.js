const mongoose = require('mongoose');
const {deleteModel} = require("mongoose");

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
  let newQuantity, totalPrice;

  return this.populate('cart.items.productId')
    .then(user => {
      const cartProduct = this.cart.items.find(cp => {
        return cp.productId._id.toString() === productId.toString();
      });
      const updatedCartItems = [ ...user.cart.items ];

      const currentQuantity = cartProduct.quantity;

      newQuantity = increase ?
        (currentQuantity + 1) :
        (currentQuantity - 1);
      totalPrice = increase ?
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

module.exports = mongoose.model('User', userSchema);

//   /**
//    * Update product amount in cart
//    * @param productId
//    * @param increase
//    * @returns {Promise<Result> | Promise<any>}
//    */
//   updateAmountInCart(productId, increase) {
//     let newQuantity, totalPrice;
//     const db = getDb();
//
//     const updatedCartItems = [ ...this.cart.items ];
//
//     return Product.fetchById(productId)
//       .then(product => {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//           return cp.productId.toString() === product._id.toString();
//         });
//
//         const currentQuantity = this.cart.items[cartProductIndex].quantity;
//
//         newQuantity = increase ?
//           (currentQuantity + 1) :
//           (currentQuantity - 1); // TODO: Fix
//         totalPrice = increase ?
//           (Number(this.cart.totalPrice) + Number(product.price)) :
//           (Number(this.cart.totalPrice) - Number(product.price));
//         updatedCartItems[cartProductIndex].quantity = newQuantity;
//
//         const updatedCart = totalPrice === 0 ? {
//           items: [],
//           totalPrice: 0
//         } : {
//           items: updatedCartItems,
//           totalPrice: totalPrice
//         }
//
//         db.collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: updatedCart } }
//           );
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   };



//   /**
//    * Add cart to orders
//    * @returns {Promise<Result> | Promise<any>}
//    */
//   addOrder() {
//     const db = getDb();
//
//     return this.getCartItems()
//       .then(products => {
//         const order = {
//           items: products,
//           totalPrice: this.cart.totalPrice,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name
//           }
//         }
//
//         return db.collection('orders').insertOne(order)
//       })
//       .then(() => {
//         this.cart = { items: [], totalPrice: 0 };
//         return db.collection('users')
//           .updateOne(
//             {_id: new ObjectId(this._id)},
//             { $set: {
//               cart: {
//                 items: [],
//                 totalPrice: 0
//               }
//             }}
//           )
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   };
//
//   /**
//    * Get orders for the user
//    * @returns {Promise<Result> | Promise<any>}
//    */
//   getOrders() {
//     return getDb().collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray()
//       .then(orders => {
//         return orders;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };
//
//   /**
//    * Get one order
//    * @param orderId
//    * @returns {Promise<Result> | Promise<any>}
//    */
//   getOrder(orderId) {
//     return getDb().collection('orders')
//       .findOne({ _id: new ObjectId(orderId) })
//         .then(order => {
//           return order;
//         })
//         .catch(err => {
//           console.log(err);
//         })
//   }
//
//   /**
//    * Fetch all users
//    * @returns {Promise<Result> | Promise<any>}
//    */
//   static fetchAll() {
//     return getDb().collection('users')
//       .find()
//       .toArray()
//       .then(users => {
//         return users;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };
//
//   /**
//    * Fetch user by id
//    * @param userId
//    * @returns {Promise<Result> | Promise<any>}
//    */
//   static fetchById(userId) {
//     return getDb().collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };
// }
//
// module.exports = User;
