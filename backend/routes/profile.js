const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/profileController");
const { authenticateToken } = require("../viable/authMiddleware");

// Get current user profile
router.get("/", authenticateToken, getProfile);

// Update profile (no image upload)
router.put("/", authenticateToken, updateProfile);

router.delete("/delete", authenticateToken, deleteAccount);

module.exports = router;
