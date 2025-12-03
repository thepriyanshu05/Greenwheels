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
 * @route   POST /api/driver/register
 * @desc    Register a new driver
 * @access  Public
 */
router.post("/register", registerDriver);

/**
 * @route   POST /api/driver/login
 * @desc    Driver login
 * @access  Public
 */
router.post("/login", loginDriver);

/**
 * @route   GET /api/driver/profile
 * @desc    Get logged-in driver profile
 * @access  Private (Driver only)
 */
router.get("/profile", protect, getDriverProfile);

/**
 * @route   GET /api/driver/my-rides
 * @desc    Get all rides offered by the logged-in driver
 * @access  Private (Driver only)
 */
router.get("/my-rides", protect, getDriverRides);

/**
 * @route   PUT /api/driver/update
 * @desc    Update driver info
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
 * @route   GET /api/driver/all
 * @desc    Get list of all drivers (admin feature)
 * @access  Private (optional, role check can be added later)
 */
router.get("/all", protect, getAllDrivers);

export default router;
