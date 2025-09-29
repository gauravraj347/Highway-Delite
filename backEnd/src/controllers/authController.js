const authService = require('../services/authService');

async function register(req, res, next) {
	try {
		const data = await authService.createUserWithOTP(req.body);
		res.status(201).json({ success: true, message: 'Registration successful. Please check your email for OTP.', data });
	} catch (err) {
		next(err);
	}
}

async function verifyOTP(req, res, next) {
	try {
		const data = await authService.verifyOTPAndIssueToken(req.body);
		res.json({ success: true, message: 'Email verified successfully', data });
	} catch (err) {
		next(err);
	}
}

async function resendOTP(req, res, next) {
	try {
		const data = await authService.resendOTP(req.body);
		res.json({ success: true, message: 'OTP sent successfully', data });
	} catch (err) {
		next(err);
	}
}

async function requestLoginOTP(req, res, next) {
	try {
		const data = await authService.requestLoginOTP(req.body);
		res.json({ success: true, message: 'Login OTP sent successfully', data });
	} catch (err) {
		next(err);
	}
}

async function login(req, res, next) {
	try {
		const data = await authService.loginWithOTP(req.body);
		res.json({ success: true, message: 'Login successful', data });
	} catch (err) {
		next(err);
	}
}

async function me(req, res) {
	res.json({ success: true, data: { user: req.user } });
}

module.exports = {
	register,
	verifyOTP,
	resendOTP,
	requestLoginOTP,
	login,
	me
};

