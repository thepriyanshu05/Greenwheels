import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * ✅ Protect routes — verifies JWT token
 * Adds the user object to req.user if valid
 */
export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};
