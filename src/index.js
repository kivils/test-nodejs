const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const shopRouter = require('./routes/shop');
const usersRouter = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
// Define path to static resources
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes started with /users
app.use('/users', usersRouter);

app.use(shopRouter);

app.use((req, res, next) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, './', 'views', '404.html'));
});

app.listen(3000);
