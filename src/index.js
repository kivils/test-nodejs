const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const csrfProtection = csrf();
const mainController = require('./controllers/main');

const User = require('./models/user');

const publicDirectory = path.join(__dirname, '..', 'public');

const MONGODB_URI = process.env.MONGODB_URI;

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
const feedRouter = require('./routes/feed');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

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
app.use(bodyParser.urlencoded({extended: false})); // x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

/**
 * Set headers for API server
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/**
 * Multipart forms parser
 */
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('product_img'));

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
 * Middleware for CSRF protection
 */
app.use(csrfProtection);

/**
 * Middleware to set locals variables to responses
 */
app.use((req, res, next) => {
  res.locals.isLogged = req.session.isLogged;
  res.locals.userEmail = req.session.user ? req.session.user.email : null;
  res.locals.scrfToken = req.csrfToken();
  next();
})

/**
 * Middleware to set up a user
 */
app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if(!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    })
});

/**
 * Middleware to pass errors to session
 */
app.use(flash());

/**
 * Routes started with /users
 */
app.use('/users', usersRouter);
app.use(shopRouter);
app.use(adminRouter);
app.use(feedRouter);
//
app.use(defaultRouter);

app.use('/error-500', mainController.getErrorPage);

app.use(mainController.getPageNotFound);

//app.use(MongoDbStore)

app.use((error, req, res, next) => {
  console.log(error)
  res.redirect('/error-500');
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    User.findOne()
      .then(user => {
        if(!user) {
          const user = new User({
            name: 'Admin',
            username: 'admin',
            email: 'admin-test@email.test',
            password: '$2a$12$hpmg96SllCVK82q7sg0M3O6EGx75JSwVccNUH3qm4ueXzZlk9Kfka', // '123'
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
