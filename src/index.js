const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

// Handlebars
const expressHbs = require('express-handlebars');

const publicDirectory = path.join(__dirname, '..', 'public');

// For frontend live reload
// @see https://bytearcher.com/articles/refresh-changes-browser-express-livereload-nodemon/
// TODO: Check how to get rid of this on production
const liveReloadServer = livereload.createServer();

liveReloadServer.watch(publicDirectory);
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// App
const defaultRouter = require('./routes/index');
const usersRouter = require('./routes/user');

const app = express();

// TEMPLATING ENGINE SETUP:
//// pug
// app.set('view engine', 'pug');
// app.set('views', 'src/pug/views');

// express-handlebars
app.engine(
  'hbs',
  expressHbs({
    layoutsDir: 'src/hbs/views/layouts',
    defaultLayout: 'main',
    extname: 'hbs'
  })
);
app.set('view engine', 'hbs');
app.set('views', 'src/hbs/views');

// For frontend live reload
app.use(connectLivereload());

app.use(bodyParser.urlencoded({extended: false}));
// Define path to static resources
app.use(express.static(publicDirectory));

// Routes started with /users
app.use('/users', usersRouter);

app.use(defaultRouter);

app.use((req, res, next) => {
  res
    .status(404)
    .render('404', { pageTitle: 'Page not found'});
});

app.listen(3000);
