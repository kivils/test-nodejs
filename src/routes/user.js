const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');

/**
 * in index.js these routes are prefixed with /users
 */

// /users/create-user => POST
router.post('/create-user', usersController.postCreateUsers);

// /users/create-user => GET
router.get('/create-user', usersController.getCreateUsers)

// /users route
router.use('/', usersController.getUsers)

module.exports = router;
