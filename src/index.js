const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mainController = require('./controllers/main');
const mongoConnect = require('./helpers/database').mongoConnect;

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
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
  next();
});

/**
 * Routes started with /users
 */
// app.use('/users', usersRouter);
app.use(shopRouter);
app.use(adminRouter);
//
app.use(defaultRouter);

// app.use(mainController.getPageNotFound);

mongoConnect(() => {
  app.listen(3000);
});
