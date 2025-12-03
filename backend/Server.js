// ==================== IMPORTS ====================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";

// ==================== LOCAL MODULES ====================
import { connectDB } from "./src/config/db.js";
import rideRoutes from "./src/routes/offer-ride.route.js";
import driverRoutes from "./src/routes/driver.route.js";
import userRoutes from "./src/routes/user.route.js";
import authRoutes from "./src/routes/auth.route.js";
import contactRoutes from "./src/routes/contact.route.js";
import confirmRideRoutes from "./src/routes/confirm-ride.route.js";
import "./src/config/passport.js"; // Passport config

// ==================== ENV + DIR CONFIG ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env
dotenv.config({ path: path.join(__dirname, ".env") });

// ==================== APP INIT ====================
const app = express();

// ==================== DATABASE ====================
connectDB();

// ==================== SECURITY ====================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(mongoSanitize()); // Prevent NoSQL injections
app.use(compression()); // Compress responses

// ==================== RATE LIMITING ====================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per 15 min
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes and stricter for /auth
app.use("/api/", generalLimiter);
app.use("/api/auth", authLimiter);

// ==================== MIDDLEWARES ====================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== SESSION & PASSPORT ====================
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "your-session-secret-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ==================== ROUTES ====================
app.get("/", (req, res) => {
  res.send("🚗 Greenwheels API is running...");
});

app.use("/api/driver", driverRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/confirm-ride", confirmRideRoutes);

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    return res
      .status(400)
      .json({ success: false, message: "Duplicate field value" });
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ================== SERVER START (Auto Port Retry v2) ==================
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_ATTEMPTS = 10;

const startServer = async (port, attemptsLeft) => {
  const server = app
    .listen(port)
    .on("listening", () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
        console.warn(`⚠️ Port ${port} in use, trying port ${port + 1}...`);
        server.close(() => startServer(port + 1, attemptsLeft - 1));
      } else {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
      }
    });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Process terminated.");
    });
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });
};

// Try ports 5000 → 5009 automatically
startServer(DEFAULT_PORT, MAX_ATTEMPTS);
