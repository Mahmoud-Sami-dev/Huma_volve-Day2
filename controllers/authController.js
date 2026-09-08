const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const { validateRegisterInput } = require("../utils/validateUserInput");
const {
  generateAccessToken,
  generateRefreshToken,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} = require("../utils/generateTokens");


const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validateRegisterInput({ name, email, password });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {

    return next(new AppError("Email already registered", 409));
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});


const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("accessToken", accessToken, getAccessCookieOptions());
  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const refreshTokenHandler = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return next(new AppError("No refresh token provided", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Refresh token expired, please login again", 401));
    }
    return next(new AppError("Invalid refresh token", 401));
  }

  if (decoded.type !== "refresh") {
    return next(new AppError("Invalid token type", 401));
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    return next(new AppError("Refresh token is no longer valid", 401));
  }

  const newAccessToken = generateAccessToken(user);
  res.cookie("accessToken", newAccessToken, getAccessCookieOptions());

  res.status(200).json({ success: true, message: "Access token refreshed" });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    // Invalidate the refresh token server-side
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (error) {
    }
  }

  res.clearCookie("accessToken", getAccessCookieOptions());
  res.clearCookie("refreshToken", getRefreshCookieOptions());

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = { register, login, refreshTokenHandler, logout };
