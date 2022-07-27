const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const usersController = require('../controllers/users');
const User = require('../models/user');

/**
 * in index.js these routes are prefixed with /users
 */

// /users/signup => POST
router.post(
  '/signup',
  check('email')
    .isEmail()
    .custom((value) => {
      return User.findOne({ 'email': value })
        .then(user => {
          if(user) {
            return Promise.reject('User with email "' + value + '" already exists');
          }
        });
    }),
  check('password')
    .isLength({ min: 8 })
    .withMessage('The password should have at least 8 characters'),
  check('password_repeat')
    .custom((value, { req }) => {
      if(value !== req.body.password_repeat) {
        throw new Error('Passwords have to match.');
      }

      return true;
    }),
  usersController.postCreateUsers
);

// // /users/signup => GET
router.get('/signup', usersController.getSignup);

// // /users/signup-success => GET
router.get('/signup-success', usersController.getSignupSuccess);

// /users/login => POST
router.post(
  '/login',
  check('email').isEmail(),
  usersController.postLogin
);

// /users/login => GET
router.get('/login', usersController.getLogin);

// /users/logout => GET
router.get('/logout', usersController.getLogout);

// // /users/reset=password => POST
router.post('/reset-password', usersController.postResetPassword);

// // /users/reset-password form => GET
router.get('/reset-password', usersController.getResetPassword);

// // /users/new-password => POST
router.post(
  '/new-password',
    check('resetPassword')
      .isLength({ min: 8 })
      .withMessage('The password should have at least 8 characters'),
    check('resetPasswordRepeat')
      .custom((value, { req }) => {
        if(value !== req.body.resetPasswordRepeat) {
          throw new Error('Passwords have to match.');
        }

        return true;
      }),
  usersController.postNewPassword
);

// // /users/new-password form => GET
router.get('/new-password/:token', usersController.getNewPassword);

// Get user
router.get('/:userId', usersController.getUser);

// /users route
router.use('/', usersController.getUsers);

module.exports = router;
