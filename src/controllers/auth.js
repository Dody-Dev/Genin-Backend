import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken } from "../utils/generatetoken.js";

// ✅ SIGNUP
export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    // generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
        token,
        
    });
});

// ✅ LOGIN
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // generate JWT token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: user, 
    token,
  });
});

// ✅ LOGOUT
export const logout = asyncHandler(async (req, res, next) => {
  // if token is in cookies: res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully. Please clear token on frontend."
  });
});
