const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sanitizeUser = (user) => {
  const sanitized = user.toObject ? user.toObject() : user;
  delete sanitized.password;
  delete sanitized.otp;
  return sanitized;
};

module.exports = {
  generateToken,
  generateOTP,
  sanitizeUser
};
