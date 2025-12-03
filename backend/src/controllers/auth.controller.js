// backend/src/controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------- Async Wrapper ----------
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ---------- Helper: Create Token ----------
const createToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---------- Helper: Send Token & Response ----------
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = createToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("jwt", token, cookieOptions);

  const { _id, name, email, role, createdAt } = user;
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: { id: _id, name, email, role, createdAt },
  });
};

// ---------- REGISTER ----------
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "user", phone, vehicle } = req.body;

  console.log("🔐 Registration attempt:", { name, email, role });

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be provided" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("❌ User already exists:", email);
    return res
      .status(409)
      .json({ success: false, message: "User already exists" });
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role,
    phone,
    vehicle,
  });

  console.log("✅ Registration successful:", email);
  sendTokenResponse(newUser, 201, res, "Registered successfully");
});

// ---------- LOGIN ----------
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("🔓 Login attempt:", email);

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and password" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  console.log("✅ Login successful:", email);
  sendTokenResponse(user, 200, res, "Login successful");
});

// ---------- PROFILE ----------
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, user });
});

// ---------- LOGOUT ----------
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// ---------- UPDATE PASSWORD ----------
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return res
      .status(400)
      .json({ success: false, message: "Current password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  sendTokenResponse(user, 200, res, "Password updated successfully");
});

// ---------- FORGOT PASSWORD (Placeholder) ----------
export const forgotPassword = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Password reset functionality will be implemented soon",
  });
});
