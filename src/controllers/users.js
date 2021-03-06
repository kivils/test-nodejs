const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

/**
 * SendGrid transporter
 */
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}));

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
    password,
    password_repeat
  } = req.body;

  const errors = validationResult(req);
  const errorsMapped = errors.array().map(error => {
    return error.msg + ' (' + error.param + ')';
  });

  // Check for existing email is in the routes/user.js
  if(!errors.isEmpty()) {
    return res.status(422)
      .render('users/signup', {
        pageTitle: 'Sign up',
        path:'/users/signup',
        user: {
          name: name,
          username: username,
          email: email,
          password: password,
          password_repeat: password_repeat,
        },
        successMessage: null,
        errorMessage: errorsMapped.join('; '),
        validationErrors: errors.array()
      })
  }

  bcrypt.hash(password, 12)
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

          return transporter.sendMail({
            to: user.email,
            from: 'iuliia.sesiunina@gmx.de',
            subject: 'Sign up successful',
            html: '<h1>You successfully signed up</h1>'
          })
        })
        .catch(err => {
          console.log(err);
        });
      })
};

/**
 * Success signup page
 * @param req
 * @param res
 */
exports.getSignupSuccess = (req, res) => {
  res.render(
    'users/signup-success',
    {
      pageTitle: 'User created!',
      path: '/users/signup-success',
      username: req.user.username
    }
  );
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
    user: null,
    successMessage: null,
    errorMessage: null,
    validationErrors: []
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

  User.findOne({ '_id': userId })
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

/**
 * Login post
 * @param req
 * @param res
 */
exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  const errorsMapped = errors.array().map(error => {
    return error.msg + ' (' + error.param + ')';
  });

  if(!errors.isEmpty()) {
    return res.status(422)
      .render('users/login', {
        pageTitle: 'Login',
        path:'/users/login',
        oldInput: {
          email: email,
          password: password
        },
        errorMessage: errorsMapped.join('; '),
        successMessage: null,
        validationErrors: errors.array()
      })
  }

  User.findOne({ email: email})
    .then(user => {
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

          res.render('users/login', {
            pageTitle: 'Login',
            path:'/users/login',
            oldInput: {
              email: email,
              password: password
            },
            errorMessage: 'Incorrect password',
            successMessage: null,
            validationErrors: [{ param: 'password' } ]
          })
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
  // flash format: ('error',  ['string1', 'string2', ...])
  let errorMessage = req.flash('error');
  let successMessage = req.flash('success');

  if(errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  }
  else {
    errorMessage = null;
  }

  if(successMessage.length > 0) {
    successMessage = successMessage[0];
  }
  else {
    successMessage = null;
  }

  res.render('users/login', {
    pageTitle: 'Login',
    path:'/users/login',
    oldInput: {
      email: '',
      password: ''
    },
    errorMessage: errorMessage,
    successMessage: successMessage,
    validationErrors: []
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

/**
 * Reset password form
 * @param req
 * @param res
 */
exports.getResetPassword = (req, res) => {
  // flash format: ('error',  ['string1', 'string2', ...])
  let errorMessage = req.flash('error');

  if(errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  }
  else {
    errorMessage = null;
  }

  res.render('users/reset-password', {
    pageTitle: 'Reset Password',
    path:'/users/reset-password',
    email: '',
    errorMessage: errorMessage
  })
};

/**
 * POST reset pass
 * @type {exports.postResetPassword}
 */
exports.postResetPassword = ((req, res) => {
  // const token = crypto.encrypt()
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      req.flash('error', [ 'Something went wrong. Please try again later.' ]);

      return res.redirect('/users/reset-password');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then(user => {
        if(!user) {
          return res.render('users/reset-password', {
            pageTitle: 'Reset Password',
            path:'/users/reset-password',
            email: req.body.email,
            errorMessage: `No account with email '${req.body.email}' found.`
          })
        }

        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 3600000;

        return user.save();
      })
      .then(result => {
        if(result) {
          req.flash('success', [`Email with instructions to reset your password are send to '${req.body.email}'.`]);
          res.redirect('/');

          transporter.sendMail({
            to: req.body.email,
            from: 'iuliia.sesiunina@gmx.de',
            subject: 'Reset password',
            html: `
            <h1>You requested password reset</h1>
            <p>Please follow this <a href="http://localhost:3000/users/new-password/${token}">link</a> to reset your password</p>
          `
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  })
});

/**
 * New password form
 * @type {exports.getNewPassword}
 */
exports.getNewPassword = ((req, res) => {
  // flash format: ('error',  ['string1', 'string2', ...])
  let errorMessage = req.flash('error');

  if(errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  }
  else {
    errorMessage = null;
  }

  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() }})
    .then(user => {
      if(!user) {
        req.flash('error', [ 'Reset link is no longer valid' ]);

        return res.redirect('/');
      }

      res.render('users/new-password', {
        pageTitle: 'New password',
        path: '/users/new-password',
        userId: user._id.toString(),
        resetToken: user.resetToken,
        password: '',
        password_repeat: '',
        errorMessage: errorMessage,
        validationErrors: []
      })
    })
    .catch(err => {
      console.log(err);
    })
});


exports.postNewPassword = ((req, res) => {
  const {
    userId,
    resetToken,
    password,
    password_repeat
  } = req.body;
  let resetUser;
  const errors = validationResult(req);
  const errorsMapped = errors.array().map(error => {
    return error.msg + ' (' + error.param + ')';
  });

  if(!errors.isEmpty()) {
    return res.status(422)
      .render('users/new-password', {
        pageTitle: 'New Password',
        path:'/users/new-password',
        userId: userId,
        resetToken: resetToken,
        password: password,
        password_repeat: password_repeat,
        errorMessage: errorsMapped.join('; '),
        successMessage: null,
        validationErrors: errors.array()
      })
  }

  User.findOne({
    resetToken: resetToken,
    resetTokenExpire: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;

      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpire = undefined;

      return resetUser.save();
    })
      .then(() => {
        // flash format: ('error',  ['string1', 'string2', ...])
        req.flash('success', [ 'Your password was successfully changed. Please login with your email' ]);

        return res.redirect('/users/login');
      })
    .catch(err => {
      console.log(err);
    })
});
