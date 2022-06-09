const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

const userForm =
  '<form action="/create-user" method="POST">' +
  '<label for="username">Pick a username</label><br/>' +
  '<input type="text" name="username" id="username"/>' +
  '<button type="submit">Join us!</button>' +
  '</form>'

app.use('/users', (req, res) => {
  res.send(
    '<p><a href="/">Our home page</a></p>' +
    '<h1>Our people</h1>' +
    '<p>We have many greate people here, just have a look!</p>' +
    '<ol>' +
    '<li>Thomas Cook</p>' +
    '<li>Robinson Crouso</p>' +
    '<li>Federico Fellini</p>' +
    '</ol>' +
    '<h2>Please join us :-)</h2>' +
    userForm
  );
})

app.post('/create-user', (req, res) => {
  console.log(req.body);
  res.send('' +
    '<p><a href="/">Our home page</a></p>' +
    '<h1>Wow <span style="color: green;">' + req.body.username + '</span>! Welcome to the club :-) !</h1>' +
    '<p>Now you are <a href="/users">one of us</a>!</p>'
  );
})

app.get('/create-user', (req, res) => {
  res.redirect('/');
})

// Should go in the end after all other use() calls
app.use('/', (req, res) => {
  res.send(
    '<h1>Hey, nice to see you!</h1>' +
    '<p>We have many greate people here, <a href="/users">just have a look</a>!</p>' +
    '<h2>Please join us :-)</h2>' +
    userForm
  );
})

app.listen(3000);
