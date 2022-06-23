const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mainController = require('./controllers/main');

const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const publicDirectory = path.join(__dirname, '..', 'public');

/**
 * !!! FOR FRONTEND LIVE RELOAD
 * @see https://bytearcher.com/articles/refresh-changes-browser-express-livereload-nodemon/
 * TODO: Check how to get rid of this on production
 */
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
//

app.use(bodyParser.urlencoded({extended: false}));
/**
 * Define path to static resources
 */
app.use(express.static(publicDirectory));

/**
 * Routes started with /users
 */
app.use('/users', usersRouter);
app.use(shopRouter);
app.use(adminRouter);

app.use(defaultRouter);

app.use(mainController.getPageNotFound);

app.listen(3000);
