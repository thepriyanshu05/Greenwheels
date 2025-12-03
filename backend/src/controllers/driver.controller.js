import Driver from "../models/driver.model.js";
import Ride from "../models/offer-rides.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================== Helper =====================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * ✅ Register a Driver
 * POST /api/driver/register
 */
export const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone, carnumber, gender } = req.body;

    if (!name || !email || !password || !carnumber) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and car number are required",
      });
    }

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res
        .status(400)
        .json({ success: false, message: "Driver already exists" });
    }

    const driver = await Driver.create({
      name,
      email,
      password,
      phone,
      carnumber,
      gender,
      role: "driver",
    });

    const token = generateToken(driver._id, "driver");

    console.log(` Driver registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: "Driver registered successfully",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        carnumber: driver.carnumber,
        gender: driver.gender,
      },
    });
  } catch (err) {
    console.error("❌ Driver registration error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ✅ Login Driver
 * POST /api/driver/login
 */
export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find driver
    const driver = await Driver.findOne({ email }).select("+password");
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Driver not found. Please register first.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(driver._id, "driver");

    console.log(`✅ Driver logged in successfully: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        carnumber: driver.carnumber,
        gender: driver.gender,
      },
    });
  } catch (err) {
    console.error("❌ Driver login error:", err.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

/**
 * 👤 Get Driver Profile
 * GET /api/driver/profile
 */
export const getDriverProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    const driver = await Driver.findById(req.user._id).select("-password");
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      driver,
    });
  } catch (err) {
    console.error("❌ Get Driver Profile Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching driver profile",
    });
  }
};

/**
 * 🚘 Get all rides offered by this driver
 * GET /api/driver/my-rides
 */
export const getDriverRides = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only drivers can view their rides",
      });
    }

    const rides = await Ride.find({ driver: req.user._id })
      .populate("passengers", "name email")
      .sort({ createdAt: -1 });

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
 * ✏️ Update Driver Profile
 * PUT /api/driver/update
 */
export const updateDriverProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only drivers can update their profile",
      });
    }

    const updates = {};
    const { name, phone, carnumber, gender } = req.body;

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (carnumber) updates.carnumber = carnumber;
    if (gender) updates.gender = gender;

    const updatedDriver = await Driver.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      driver: updatedDriver,
    });
  } catch (err) {
    console.error("❌ Update Driver Profile Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

/**
 * ❌ Delete Driver Account
 * DELETE /api/driver/delete
 */
export const deleteDriverAccount = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Access denied — not a driver",
      });
    }

    await Driver.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "Driver account deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete Driver Account Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 👥 Get All Drivers
 * GET /api/driver/all
 */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select(
      "name email phone carnumber gender createdAt"
    );

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (err) {
    console.error("❌ Get All Drivers Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
