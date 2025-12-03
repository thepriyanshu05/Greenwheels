import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyBookings } from "../controllers/booking.controller.js";

const router = express.Router();

/**
 * @route   GET /api/bookings/my
 * @desc    Get all rides booked by the logged-in user
 * @access  Private (User only)
 */
router.get("/my", protect, getMyBookings);

export default router;
