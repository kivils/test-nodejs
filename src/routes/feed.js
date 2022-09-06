const express = require('express');
const feedController = require('../controllers/feed');

const router = express.Router();

router.post('/feed/post', feedController.createPost);
router.get('/feed', feedController.getPosts);

module.exports = router;
