const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', auth, getCurrentUser);

module.exports = router; 