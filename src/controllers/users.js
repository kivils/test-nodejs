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

  const user = new User(name, username, email);

  user.save()
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
  User.fetchAll()
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
};

/**
 * Get user page
 * @param req
 * @param res
 */
exports.getUser = (req, res) => {
  const userId = req.params.userId;

  User.fetchById(userId)
    .then(user => {
      res.render('users/user-card', {
        pageTitle: 'User ' + user.name,
        path: '/users',
        user: user
      });
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Redirect to the Main page when came directly without form submission
 * @param req
 * @param res
 */
exports.getCreateUsers = (req, res) => {
  res.redirect('/');
};
