const User = require("../models/User");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");


const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  const skip = (Number(page) - 1) * Number(limit);
  const users = await User.find(filter).skip(skip).limit(Number(limit));
  const total = await User.countDocuments(filter);
  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: Number(page),
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { password, ...updateData } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ success: true, message: "User deleted", data: {} });
});

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
