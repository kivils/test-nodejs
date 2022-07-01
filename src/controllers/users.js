const User = require('../models/user');

/**
 * Create a user
 * @param req
 * @param res
 */
exports.postCreateUsers = (req, res) => {
  const {
    name,
    username,
    email
  } = req.body;

  User.create({
    name: name,
    username: username,
    email: email
  })
    .then( user => {
      res.render(
        'users/create-user',
        {
          pageTitle: 'Create user',
          path: '/users/create-user',
          user: user
        }
      );
    })
    .catch(err => {
      console.log(err);
    })
}

/**
 * Get users
 * @param req
 * @param res
 */
exports.getUsers = (req, res) => {
  User.findAll()
    .then(users => {
      res.render('users/users', {
        pageTitle: 'Our people',
        users: users,
        path: '/users'
      });
    })
    .catch(err => {
      console.log(err);
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
