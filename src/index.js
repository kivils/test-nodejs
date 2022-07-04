const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./helpers/database');

const mainController = require('./controllers/main');

const publicDirectory = path.join(__dirname, '..', 'public');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

/**
 * !!! FOR FRONTEND LIVE RELOAD
 * @see https://bytearcher.com/articles/refresh-changes-browser-express-livereload-nodemon/
 * TODO: Check how to get rid of this on production
 */
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const liveReloadServer = livereload.createServer();

liveReloadServer.watch(publicDirectory);
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
//

// APP
const defaultRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

const app = express();

/**
 * TEMPLATING ENGINE SETUP:
 */
app.set('view engine', 'ejs');
app.set('views', 'src/views/ejs/views');

/**
 * !!! FOR FRONTEND LIVE RELOAD
 */
app.use(connectLivereload());

/**
 * Body-parser for requests
 */
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Define path to static resources
 */
app.use(express.static(publicDirectory));

/**
 * Middleware to retrieve admin user; then it can be used throughout an app
 */
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

/**
 * Routes started with /users
 */
app.use('/users', usersRouter);
app.use(shopRouter);
app.use(adminRouter);

app.use(defaultRouter);

app.use(mainController.getPageNotFound);

/**
 * Creating relations between tables in db
 */
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Cart.hasMany(CartItem);

/**
 * Syncing with mysql database using sequelize library
 */
sequelize
  .sync()
  .then(() => {
    return User.findByPk(1); // Dummy user
  })
  .then(user => {
    if(!user) {
      return User.create({ name: 'Admin user', username: 'username', email: 'test@test.email' });
    }
    else {
      return Promise.resolve(user);
    }
  })
  .then(user => {
    return user.createCart();
  })
  .then(() => {
    // start to listen to a server only if:
    // - db connection is successful
    // - default cart for default user is created
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
