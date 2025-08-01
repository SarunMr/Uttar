const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../viable/authMiddleware");
const {
  searchUsersPublic,
  getUserProfilePublic,
  getUserPostsPublic,
} = require("../controllers/userController");

// All routes require authentication but NOT admin role
router.use(authenticateToken);

// Search users (public version)
router.get("/search", searchUsersPublic);

// Get user profile (public version)
router.get("/:id", getUserProfilePublic);

// Get user's posts (public version)
router.get("/:id/posts", getUserPostsPublic);

module.exports = router;
