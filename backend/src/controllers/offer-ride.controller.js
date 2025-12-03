import Ride from "../models/offer-rides.model.js";

/**
 * 🚗 Offer a new ride (Driver only)
 * POST /api/rides/offer
 */
export const offerRide = async (req, res) => {
  try {
    const { from, to, date, seatsAvailable, fare, vehicle } = req.body;

    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can offer rides",
      });
    }

    if (!from || !to || !date || !seatsAvailable || !fare || !vehicle) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to offer a ride",
      });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      from,
      to,
      date,
      seatsAvailable,
      fare,
      vehicle,
      status: "available",
    });

    console.log(`✅ Ride offered by ${req.user.name} from ${from} to ${to}`);

    res.status(201).json({
      success: true,
      message: "Ride offered successfully",
      ride,
    });
  } catch (err) {
    console.error("❌ Offer Ride Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🚘 Get all available rides (Public)
 * GET /api/rides/available
 */
export const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "available" })
      .populate("driver", "name email phone carnumber")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (err) {
    console.error("❌ Get Available Rides Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🎟️ Book a ride (User only)
 * POST /api/rides/book
 */
export const bookRide = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can book rides",
      });
    }

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride ID is required",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    if (ride.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Ride is no longer available",
      });
    }

    if (ride.passengers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this ride",
      });
    }

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this ride",
      });
    }

    // Add user to passengers
    ride.passengers.push(req.user._id);
    ride.seatsAvailable -= 1;

    if (ride.seatsAvailable <= 0) {
      ride.status = "booked";
    }

    await ride.save();

    console.log(`🎟️ Ride booked by ${req.user.name} (${req.user.email})`);

    res.status(200).json({
      success: true,
      message: "Ride booked successfully",
      ride,
    });
  } catch (err) {
    console.error("❌ Book Ride Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 👤 Get user’s booked rides
 * GET /api/rides/user
 */
export const getUserRides = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only users can view booked rides",
      });
    }

    const rides = await Ride.find({ passengers: req.user._id })
      .populate("driver", "name email phone carnumber")
      .sort({ date: -1 });

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
 * 🚖 Get driver’s offered rides
 * GET /api/rides/driver
 */
export const getDriverRides = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Access denied — not a driver",
      });
    }

    const rides = await Ride.find({ driver: req.user._id })
      .populate("passengers", "name email phone")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (err) {
    console.error("❌ Get Driver Rides Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ❌ Cancel a ride (Driver only)
 * PATCH /api/rides/cancel/:rideId
 */
export const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can cancel rides",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own rides",
      });
    }

    ride.status = "cancelled";
    await ride.save();

    console.log(`❌ Ride cancelled by driver: ${req.user.name}`);

    res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (err) {
    console.error("❌ Cancel Ride Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
