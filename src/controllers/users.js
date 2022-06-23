const User = require('../models/user');

/**
 * Create a user
 * @param req
 * @param res
 */
exports.postCreateUsers = (req, res) => {
  const username = req.body.username;
  const user = new User(username);

  res.render(
      'users/create-user',
      {
        pageTitle: 'Create user',
        path: '/users/create-user',
        username: username
      }
  );

  user.save();
}

/**
 * Get users
 * @param req
 * @param res
 */
exports.getUsers = (req, res) => {
  User.fetchAll(users => {
    res.render('users/users', {
      pageTitle: 'Our people',
      users: users,
      path: '/users'
    });
  });
}

/**
 * Redirect to the Main page when came directly without form submission
 * @param req
 * @param res
 */
exports.getCreateUsers = (req, res) => {
  res.redirect('/');
}
