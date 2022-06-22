const User = require('../models/user');

/**
 * Create a user
 * @param req
 * @param res
 */
exports.postCreateUsers = (req, res) => {
  const user = new User(req.body.username);

  res.render(
      'create-user',
      {
        pageTitle: 'Create user',
        path: '/users/create-user',
        username: req.body.username
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
    res.render('users', {
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
