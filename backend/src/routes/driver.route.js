import express from "express";
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  getDriverRides,
  getAllDrivers,
  updateDriverProfile,
  deleteDriverAccount,
} from "../controllers/driver.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ============================
 * 🚗 DRIVER AUTH ROUTES
 * ============================
 */

/**
 * @route   POST /api/driver/register
 * @desc    Register a new driver
 * @access  Public
 */
router.post("/register", registerDriver);

/**
 * @route   POST /api/driver/login
 * @desc    Authenticate driver & return token
 * @access  Public
 */
router.post("/login", loginDriver);

/**
 * ============================
 * 👤 DRIVER PROFILE ROUTES
 * ============================
 */

/**
 * @route   GET /api/driver/profile
 * @desc    Get logged-in driver profile
 * @access  Private (Driver only)
 */
router.get("/profile", protect, getDriverProfile);

/**
 * @route   PUT /api/driver/update
 * @desc    Update driver profile
 * @access  Private (Driver only)
 */
router.put("/update", protect, updateDriverProfile);

/**
 * @route   DELETE /api/driver/delete
 * @desc    Delete driver account
 * @access  Private (Driver only)
 */
router.delete("/delete", protect, deleteDriverAccount);

/**
 * ============================
 * 🚘 DRIVER RIDES ROUTES
 * ============================
 */

/**
 * @route   GET /api/driver/my-rides
 * @desc    Get all rides created by the driver
 * @access  Private (Driver only)
 */
router.get("/my-rides", protect, getDriverRides);

/**
 * ============================
 * 👥 ADMIN/UTILITY ROUTES
 * ============================
 */

/**
 * @route   GET /api/driver/all
 * @desc    Get all drivers (admin or internal)
 * @access  Private (optional)
 */
router.get("/all", protect, getAllDrivers);

export default router;
