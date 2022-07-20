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

  const user = new User({
    name: name,
    username: username,
    email: email,
    cart: {
      items: [],
      totalPrice: 0
    }
  });
  // Set a session
  req.session.isLogged = true;

  user.save()
    .then( user => {
      res.render(
        'users/create-user',
        {
          pageTitle: 'Create user',
          path: '/users/create-user',
          user: user,
          isLogged: req.session.isLogged
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
  User.find()
    .then(users => {
      res.render('users/users', {
        pageTitle: 'Our people',
        users: users,
        path: '/users',
        isLogged: req.session.isLogged
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

  User.findOne({ '_id': userId })
    .then(user => {
      res.render('users/user-card', {
        pageTitle: 'User ' + user.name,
        path: '/users',
        user: user,
        isLogged: req.session.isLogged
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

exports.postLogin = (req, res) => {
  User.findById('62d0533c8a209e09491a86a5')
    .then(user => {
      // Save user in session
      req.session.isLogged = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      })
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getLogin = (req, res) => {
  res.render('users/login', {
    pageTitle: 'Login',
    path:'/users/login',
    isLogged: req.session.isLogged
  })
};

exports.getLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
