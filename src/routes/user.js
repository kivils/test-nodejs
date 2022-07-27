const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const usersController = require('../controllers/users');

/**
 * in index.js these routes are prefixed with /users
 */

// /users/create-user => POST
router.post(
  '/create-user',
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('password_repeat').custom((value, { req }) => {
    if(value !== req.body.password_repeat) {
      throw new Error('Passwords have to match.');
    }

    return true;
  }),
  usersController.postCreateUsers
);

// /users/create-user => GET
router.get('/create-user', usersController.getCreateUsers);

// /users/login => POST
router.post(
  '/login',
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  usersController.postLogin
);

// /users/login => GET
router.get('/login', usersController.getLogin);

// /users/logout => GET
router.get('/logout', usersController.getLogout);

// /users/signup => POST
router.post('/signup', usersController.postCreateUsers);

// // /users/signup => GET
router.get('/signup', usersController.getSignup);

// // /users/reset=password => POST
router.post('/reset-password', usersController.postResetPassword);

// // /users/reset-password form => GET
router.get('/reset-password', usersController.getResetPassword);

// // /users/new-password => POST
router.post('/new-password', usersController.postNewPassword);

// // /users/new-password form => GET
router.get('/new-password/:token', usersController.getNewPassword);

// Get user
router.get('/:userId', usersController.getUser);

// /users route
router.use('/', usersController.getUsers);

module.exports = router;
