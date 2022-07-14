const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const mainController = require('./controllers/main');

const User = require('./models/user');

const publicDirectory = path.join(__dirname, '..', 'public');

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
app.set('views', 'src/views');

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
// app.use((req, res, next) => {
  // User.fetchById('62cbf0caaaa85f73485c63b4') // Manually created user in mongodb
  //   .then(user => {
  //     req.user = new User(
  //       user.name,
  //       user.username,
  //       user.email,
  //       user.cart, // { items: [], totalPrice: 0 }
  //       user._id
  //     );
  //     next();
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })

  // TODO: Leftovers: try to reimplement this
  // User.fetchAll()
  //   .then(users => {
  //     if(users.length > 0) {
  //       return users[0];
  //     }
  //     else { // Create default admin user if no users in db yet
  //       const user = new User(
  //         'Admin',
  //         'admin-nick',
  //         'admin@admin.admin'
  //       );
  //
  //       user.save(this)
  //         .then(user => {
  //           const currentUserId = new mongodb.ObjectId(user._id);
  //
  //           User.fetchById(currentUserId)
  //             .then(user => {
  //               req.user = user;
  //             })
  //         })
  //         .catch(err => console.log(err));
  //     }
  //   })
  //   .catch(err => console.log(err));
  //   next();
// });

/**
 * Routes started with /users
 */
app.use('/users', usersRouter);
app.use(shopRouter);
app.use(adminRouter);
//
app.use(defaultRouter);

app.use(mainController.getPageNotFound);

mongoose.connect('mongodb+srv://root-user4:yIiW6OHSJs847C5e@cluster0.jylqx0x.mongodb.net/shop?retryWrites=true&w=majority')
  .then(() => {
    app.listen('3000');
  })
  .catch(err => {
    console.log(err);
  });
