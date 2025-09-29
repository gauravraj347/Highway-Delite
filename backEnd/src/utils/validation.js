const { body } = require('express-validator');

// Common validation rules
const emailValidation = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please enter a valid email address')
  .normalizeEmail();

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  emailValidation,
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please enter a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        throw new Error('You must be at least 13 years old');
      }
      
      if (age > 120) {
        throw new Error('Please enter a valid date of birth');
      }
      
      return true;
    })
];

// OTP verification validation
const validateOTP = [
  emailValidation,
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

// Login validation
const validateLogin = [
  emailValidation,
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

// Note creation validation
const validateNoteCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Note title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
];

module.exports = {
  validateRegistration,
  validateOTP,
  validateLogin,
  validateNoteCreation,
  emailValidation
};
