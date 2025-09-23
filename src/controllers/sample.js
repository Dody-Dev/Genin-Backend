import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/mail.js';
import crypto from 'crypto';

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ success: false, message: "User already exists" });
    return;
  }

  const user = await User.create({ name, email, password });

  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;
  const message = `Please click on the following link to verify your email address:\n\n ${verifyUrl}`;

  await sendEmail({
    email: user.email,
    subject: 'Email Verification',
    message: message
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully. A verification link has been sent to your email.'
  });
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Please provide an email and password' });
    return;
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }
  
  if (!user.isVerified) {
    res.status(401).json({ success: false, message: 'Please verify your email address first.' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: user,
  });
});

// @desc      Get current logged in user
// @route     GET /api/auth/current-user
// @access    Private
export const currentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc      Log user out
// @route     POST /api/auth/logout
// @access    Private
export const logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc      Verify user's email address
// @route     GET /api/auth/verify-email
// @access    Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  const verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: verificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    return;
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Email verified successfully!' });
});

// @desc      Forgot password
// @route     POST /api/auth/forgot-password
// @access    Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ success: false, message: 'No user with that email.' });
    return;
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;
  const message = `You are receiving this because you (or someone else) has requested to reset the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n ${resetUrl}\n\n`;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Token',
    message: message
  });

  res.status(200).json({ success: true, message: 'Password reset link sent to email.' });
});
