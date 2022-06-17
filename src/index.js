const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

/**
 * HANDLEBARS
 */
// const expressHbs = require('express-handlebars');

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

const app = express();

/**
 * TEMPLATING ENGINE SETUP:
 */

/**
 * PUG
 */
// app.set('view engine', 'pug');
// app.set('views', 'src/templates/pug/views');

/**
 * EXPRESS-HANDLEBARS
 */
// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'src/templates/hbs/views/layouts',
//     defaultLayout: 'main',
//     extname: 'hbs'
//   })
// );
// app.set('view engine', 'hbs');
// app.set('views', 'src/templates/hbs/views');

/**
 * EJS
 */
app.set('view engine', 'ejs');
app.set('views', 'src/templates/ejs/views');


/**
 * !!! FOR FRONTEND LIVE RELOAD
 */
app.use(connectLivereload());
//

app.use(bodyParser.urlencoded({extended: false}));
// Define path to static resources
app.use(express.static(publicDirectory));

// Routes started with /users
app.use('/users', usersRouter);

app.use(defaultRouter);

app.use((req, res, next) => {
  res
    .status(404)
    .render('404', { path: '', pageTitle: 'Page not found'});
});

app.listen(3000);
