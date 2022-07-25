const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');

/**
 * in index.js these routes are prefixed with /users
 */

// /users/create-user => POST
router.post('/create-user', usersController.postCreateUsers);

// /users/create-user => GET
router.get('/create-user', usersController.getCreateUsers);

// /users/login => POST
router.post('/login', usersController.postLogin);

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
