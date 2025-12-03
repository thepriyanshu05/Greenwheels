import express from "express";
import {
  offerRide,
  getAvailableRides,
  bookRide,
  getDriverRides,
  getUserRides,
  cancelRide,
} from "../controllers/offer-ride.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ============================
 * 🚗 DRIVER RIDE ROUTES
 * ============================
 */

/**
 * @route   POST /api/rides/offer
 * @desc    Driver offers a new ride
 * @access  Private (Driver)
 */
router.post("/offer", protect, offerRide);
router.post("/offer-ride", protect, offerRide);

/**
 * @route   GET /api/rides/driver
 * @desc    Get all rides offered by logged-in driver
 * @access  Private (Driver)
 */
router.get("/driver", protect, getDriverRides);

/**
 * @route   PATCH /api/rides/cancel/:rideId
 * @desc    Cancel a ride offered by driver
 * @access  Private (Driver)
 */
router.patch("/cancel/:rideId", protect, cancelRide);

/**
 * ============================
 * 🚘 USER RIDE ROUTES
 * ============================
 */

/**
 * @route   POST /api/rides/book
 * @desc    Book a ride as a user
 * @access  Private (User)
 */
router.post("/book", protect, bookRide);

/**
 * @route   GET /api/rides/user
 * @desc    Get all rides booked by logged-in user
 * @access  Private (User)
 */
router.get("/user", protect, getUserRides);

/**
 * ============================
 * 🌍 PUBLIC RIDE ROUTES
 * ============================
 */

/**
 * @route   GET /api/rides/available
 * @desc    Get all available rides
 * @access  Public
 */
router.get("/available", getAvailableRides);

export default router;
