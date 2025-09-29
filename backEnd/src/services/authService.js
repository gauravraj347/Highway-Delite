const User = require('../models/User');
const { generateToken, generateOTP, sanitizeUser } = require('../utils/helpers');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/email');

// Helper function to generate and set OTP
async function generateAndSetOTP(user) {
	const otp = generateOTP();
	const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
	user.otp = { code: otp, expiresAt: otpExpiry };
	await user.save();
	return { otp, otpExpiry };
}

// Helper function to send OTP email
async function sendOTPAndHandleError(email, otp, name) {
	const emailResult = await sendOTPEmail(email, otp, name);
	if (!emailResult.success) {
		const error = new Error('Failed to send OTP email. Please try again.');
		error.status = 500;
		throw error;
	}
	return emailResult;
}

async function createUserWithOTP({ name, email, dateOfBirth }) {
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		const error = new Error('User with this email already exists');
		error.status = 400;
		throw error;
	}

	const user = new User({
		name,
		email,
		dateOfBirth,
		otp: { code: generateOTP(), expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
	});
	await user.save();

	await sendOTPAndHandleError(email, user.otp.code, name);
	return { email: user.email, expiresAt: user.otp.expiresAt };
}

async function verifyOTPAndIssueToken({ email, otp }) {
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}

	if (!user.otp || user.otp.code !== otp) {
		const error = new Error('Invalid OTP');
		error.status = 400;
		throw error;
	}
	if (user.otp.expiresAt < new Date()) {
		const error = new Error('OTP has expired. Please request a new one.');
		error.status = 400;
		throw error;
	}

	user.isEmailVerified = true;
	user.otp = undefined;
	await user.save();

	await sendWelcomeEmail(email, user.name);
	const token = generateToken({ id: user._id });
	return { token, user: sanitizeUser(user) };
}

async function resendOTP({ email }) {
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}
	const { otp, otpExpiry } = await generateAndSetOTP(user);
	await sendOTPAndHandleError(email, otp, user.name);
	return { email: user.email, expiresAt: otpExpiry };
}

async function requestLoginOTP({ email }) {
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}
	if (!user.isEmailVerified) {
		const error = new Error('Please verify your email first');
		error.status = 400;
		throw error;
	}
	const { otp, otpExpiry } = await generateAndSetOTP(user);
	await sendOTPAndHandleError(email, otp, user.name);
	return { email: user.email, expiresAt: otpExpiry };
}

async function loginWithOTP({ email, otp }) {
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}
	if (!user.isEmailVerified) {
		const error = new Error('Please verify your email first');
		error.status = 400;
		throw error;
	}
	if (!user.otp || user.otp.code !== otp) {
		const error = new Error('Invalid OTP');
		error.status = 400;
		throw error;
	}
	if (user.otp.expiresAt < new Date()) {
		const error = new Error('OTP has expired. Please request a new one.');
		error.status = 400;
		throw error;
	}
	user.otp = undefined;
	await user.save();
	const token = generateToken({ id: user._id });
	return { token, user: sanitizeUser(user) };
}

module.exports = {
	createUserWithOTP,
	verifyOTPAndIssueToken,
	resendOTP,
	requestLoginOTP,
	loginWithOTP
};
