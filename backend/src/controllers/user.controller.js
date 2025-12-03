import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Ride from "../models/offer-rides.model.js";

// ====================== Helper ======================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * ✅ Register a User
 * POST /api/user/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      role: "user",
    });

    // Generate JWT
    const token = generateToken(user._id, "user");

    console.log(`✅ User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ User registration error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ✅ Login User
 * POST /api/user/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, "user");

    console.log(`✅ User logged in successfully: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ User login error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

/**
 * 👤 Get User Profile
 * GET /api/user/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ Get User Profile Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

/**
 * 🚘 Get rides booked by this user
 * GET /api/user/my-rides
 */
export const getUserRides = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only users can view booked rides",
      });
    }

    const rides = await Ride.find({ passengers: req.user._id })
      .populate("driver", "name email carnumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (err) {
    console.error("❌ Get User Rides Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ✏️ Update User Profile
 * PUT /api/user/update
 */
export const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only users can update their profile",
      });
    }

    const updates = {};
    const { name, phone, gender } = req.body;

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (gender) updates.gender = gender;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update User Profile Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

/**
 * ❌ Delete User Account
 * DELETE /api/user/delete
 */
export const deleteUserAccount = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied — not a user",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete User Account Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 👥 Get All Users
 * GET /api/user/all
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "name email phone gender createdAt"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("❌ Get All Users Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
