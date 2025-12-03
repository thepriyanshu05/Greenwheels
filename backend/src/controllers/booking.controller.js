import Booking from "../models/booking.model.js";

export const getMyBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "ride",
        populate: { path: "driver", select: "name email phone carnumber" },
      })
      .sort({ bookedAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("❌ Get My Bookings Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};
