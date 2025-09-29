const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { validateRegistration, validateOTP, validateLogin, emailValidation } = require('../utils/validation');
const authController = require('../controllers/authController');

const router = express.Router();

// Register user and send OTP
router.post('/register', validateRegistration, handleValidationErrors, authController.register);

// Verify OTP and complete registration
router.post('/verify-otp', validateOTP, handleValidationErrors, authController.verifyOTP);

// Resend OTP
router.post('/resend-otp', [emailValidation], handleValidationErrors, authController.resendOTP);

// Login with OTP
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Request login OTP
router.post('/request-login-otp', [emailValidation], handleValidationErrors, authController.requestLoginOTP);

// Get current user
router.get('/me', authenticateToken, authController.me);

module.exports = router;
