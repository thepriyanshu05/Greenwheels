import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserRides,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ============================
 * 👤 USER AUTH ROUTES
 * ============================
 */

/**
 * @route   POST /api/user/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/user/login
 * @desc    Authenticate user & return token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * ============================
 * 🙍‍♂️ USER PROFILE ROUTES
 * ============================
 */

/**
 * @route   GET /api/user/profile
 * @desc    Get logged-in user profile
 * @access  Private (User only)
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route   PUT /api/user/update
 * @desc    Update user info
 * @access  Private (User only)
 */
router.put("/update", protect, updateUserProfile);

/**
 * @route   DELETE /api/user/delete
 * @desc    Delete user account
 * @access  Private (User only)
 */
router.delete("/delete", protect, deleteUserAccount);

/**
 * ============================
 * 🚘 USER RIDE ROUTES
 * ============================
 */

/**
 * @route   GET /api/user/my-rides
 * @desc    Get all rides booked by the logged-in user
 * @access  Private (User only)
 */
router.get("/my-rides", protect, getUserRides);

/**
 * ============================
 * 👥 ADMIN/UTILITY ROUTES
 * ============================
 */

/**
 * @route   GET /api/user/all
 * @desc    Get all registered users
 * @access  Private (optional - can be restricted later)
 */
router.get("/all", getAllUsers);

export default router;
