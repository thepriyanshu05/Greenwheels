import express from "express";
import {
  offerRide,
  getAvailableRides,
  bookRide,
  getDriverRides,
  getUserRides,
  cancelRide,
} from "../controllers/ride.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/rides/offer
 * @desc    Driver offers a new ride
 * @access  Private (Driver)
 */
router.post("/offer", protect, offerRide);

/**
 * @route   GET /api/rides/available
 * @desc    Get all available rides
 * @access  Public
 */
router.get("/available", getAvailableRides);

/**
 * @route   POST /api/rides/book
 * @desc    User books a ride
 * @access  Private (User)
 */
router.post("/book", protect, bookRide);

/**
 * @route   GET /api/rides/driver
 * @desc    Get rides offered by logged-in driver
 * @access  Private (Driver)
 */
router.get("/driver", protect, getDriverRides);

/**
 * @route   GET /api/rides/user
 * @desc    Get rides booked by logged-in user
 * @access  Private (User)
 */
router.get("/user", protect, getUserRides);

/**
 * @route   PATCH /api/rides/cancel/:rideId
 * @desc    Driver cancels a ride
 * @access  Private (Driver)
 */
router.patch("/cancel/:rideId", protect, cancelRide);

export default router;
