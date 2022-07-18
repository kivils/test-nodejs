const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const mainController = require('./controllers/main');

const User = require('./models/user');

const publicDirectory = path.join(__dirname, '..', 'public');

const MONGODB_URI = 'mongodb+srv://root-user4:yIiW6OHSJs847C5e@cluster0.jylqx0x.mongodb.net/shop';

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
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

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
 * Middleware for sessions
 */
app.use(
  session({
    secret: 'Some secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

/**
 * Routes started with /users
 */
app.use('/users', usersRouter);
app.use(shopRouter);
app.use(adminRouter);
//
app.use(defaultRouter);

app.use(mainController.getPageNotFound);

//app.use(MongoDbStore)

mongoose.connect(MONGODB_URI)
  .then(() => {
    User.findOne()
      .then(user => {
        if(!user) {
          const user = new User({
            name: 'Admin',
            username: 'admin',
            email: 'admin-test@email.test',
            cart: {
              items: [],
              totalPrice: 0
            }
          });

          user.save();
        }
      })
      .catch(err => {
        console.log(err);
      })
    app.listen('3000');
  })
  .catch(err => {
    console.log(err);
  });
