const bcrypt = require('bcryptjs');
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
    email,
    password
  } = req.body;

  User.findOne({ 'email': email })
    .then(user => {
      if(user) {
        res.render(
          'users/create-user',
          {
            pageTitle: 'Create user',
            path: '/users/create-user',
            user: null,
            userEmail: email,
            isLogged: req.session.isLogged
          }
        );
      }
      else {
        return bcrypt.hash(password, 12);
      }
    })
    .then(passEncrypted => {
      if(passEncrypted === undefined) {
        return;
      }

      const user = new User({
        name: name,
        username: username,
        email: email,
        password: passEncrypted,
        cart: {
          items: [],
          totalPrice: 0
        }
      });

      user.save()
        .then( user => {
          req.session.user = user;
          res.render(
            'users/create-user',
            {
              pageTitle: 'User created!',
              path: '/users/create-user',
              user: user,
              isLogged: req.session.isLogged
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
      })

};

/**
 * Signup form
 * @param req
 * @param res
 */
exports.getSignup = (req, res) => {
  res.render('users/signup', {
    pageTitle: 'Sign  up',
    path:'/users/signup',
    isLogged: req.session.isLogged
  })
};

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

/**
 * Login post
 * @param req
 * @param res
 */
exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email})
    .then(user => {
      if(!user) {
        return res.redirect('/users/login');
      }

      bcrypt
        .compare(password, user.password)
        .then(match => { // Both matching and not matching passwords
          if(match) {
            // Save user in session
            req.session.isLogged = true;
            req.session.user = user;

            return req.session.save(err => {
              if(err) {
                console.log(err);
              }

              res.redirect('/');
            })
          }

          res.redirect('/users/login')
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    })
};

/**
 * Login form
 * @param req
 * @param res
 */
exports.getLogin = (req, res) => {
  res.render('users/login', {
    pageTitle: 'Login',
    path:'/users/login',
    isLogged: req.session.isLogged
  })
};

/**
 * Logout
 * @param req
 * @param res
 */
exports.getLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
