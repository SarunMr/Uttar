const express = require("express");
const router = express.Router();
const {
  searchUsers,
  getUserProfile,
  getUserPosts,
  deleteUserPost,
  activateUser,
  deactivateUser,
  promoteUser,
  demoteAdmin,
} = require("../controllers/adminController.js");
const { authenticateToken, requireAdmin } = require("../viable/authMiddleware");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Search users
router.get("/search", searchUsers);

// Get user profile
router.get("/:id", getUserProfile);

// Get user's posts
router.get("/:id/posts", getUserPosts);

// User management actions
router.put("/:id/activate", activateUser);
router.put("/:id/deactivate", deactivateUser);
router.put("/:id/promote", promoteUser);
router.put("/:id/demote", demoteAdmin);

module.exports = router;
