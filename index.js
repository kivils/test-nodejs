const express = require('express');

const app = express();

app.use('/users', (req, res) => {
  console.log('In User middleware');
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
    '<form action="/create-user" method="POST">' +
    '<label for="username">Pick a username</label><br/>' +
    '<input type="text" name="username" id="username"/>' +
    '<button type="submit">Join us!</button>' +
    '</form>'
  );
})

app.use('/create-user', (req, res) => {
  console.log('In Create User middleware');
  res.send('<h1>Welcome to the Club!</h1>');
})

// Should go in the end after all other use() calls
app.use('/', (req, res) => {
  console.log('In Default middleware');
  res.send(
    '<h1>Hey, nice to see you!</h1>' +
    '<p>We have many greate people here, <a href="/users">just have a look</a>!</p>' +
    '<h2>Please join us :-)</h2>' +
    '<form action="/create-user" method="POST">' +
    '<label for="username">Pick a username</label><br/>' +
    '<input type="text" name="username" id="username"/>' +
    '<button type="submit">Join us!</button>' +
    '</form>'
  );
})

app.listen(3000);
