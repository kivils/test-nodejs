const express = require('express');
const bodyParser = require('body-parser');

const shopRouter = require('./routes/shop');
const usersRouter = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// Routes started with /users
app.use('/users', usersRouter);

app.use(shopRouter);

app.use((req, res, next) => {
  res
    .status(404)
    .send(
      '<h1>Page not found</h1>' +
      '<p><a href="/">Please check our home page</a></p>'
    );
});

app.listen(3000);
