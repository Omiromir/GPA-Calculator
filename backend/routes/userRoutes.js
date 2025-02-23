// backend/routes/userRoutes.js
const express = require("express");
const { getUserProfile, updateUserProfile, changePassword,deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's profile (Protected)
router.get("/profile", authMiddleware, getUserProfile);

// Update logged-in user's profile (Protected)
router.put("/profile", authMiddleware, updateUserProfile);

// Compare current password and update it for logged-in user's profile (Protected)
router.put("/change-password", authMiddleware, changePassword);

//Delete logged-in user's profile (Protected)
router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;