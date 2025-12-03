import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserRides,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/my-rides", protect, getUserRides);
router.put("/update", protect, updateUserProfile);
router.delete("/delete", protect, deleteUserAccount);
router.get("/all", getAllUsers);

export default router;
