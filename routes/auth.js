const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login Page
router.get('/login', authController.getLoginPage);

// Register Page
router.get('/register', authController.getRegisterPage);

// Register Handle
router.post('/register', authController.registerUser);

// Login Handle
router.post('/login', authController.loginUser);

// Logout Handle
router.get('/logout', authController.logoutUser);

module.exports = router;