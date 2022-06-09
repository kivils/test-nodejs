const userForm =
  '<form action="/users/create-user" method="POST">' +
  '<label for="username">Pick a username</label><br/>' +
  '<input type="text" name="username" id="username"/>' +
  '<button type="submit">Join us!</button>' +
  '</form>'

module.exports = userForm;
