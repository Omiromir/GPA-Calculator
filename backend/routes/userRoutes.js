const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
  getAllUsersWithGPA,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get logged-in user's profile (Protected)
router.get("/profile", authMiddleware, getUserProfile);

// Update logged-in user's profile (Protected)
router.put("/profile", authMiddleware, updateUserProfile);

// Compare current password and update it for logged-in user's profile (Protected)
router.put("/change-password", authMiddleware, changePassword);

// Delete logged-in user's profile (Protected)
router.delete("/profile", authMiddleware, deleteUser);

// Get all users with GPA (Admin only)
router.get("/all", authMiddleware, adminMiddleware, getAllUsersWithGPA);

module.exports = router;