import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";

/**
 * ✅ Protect routes — verifies JWT token for both users and drivers
 * If valid, attaches the authenticated entity (user or driver) to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find the user or driver by ID
      let authenticatedUser =
        (await User.findById(decoded.id).select("-password")) ||
        (await Driver.findById(decoded.id).select("-password"));

      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed — user not found",
        });
      }

      // Attach user/driver object and role to request
      req.user = authenticatedUser;
      req.user.role = decoded.role || "user"; // fallback if role missing

      return next();
    }

    // No token present
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
