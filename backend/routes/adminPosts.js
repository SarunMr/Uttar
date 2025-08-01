const express = require("express");
const router = express.Router();
const { deleteUserPost } = require("../controllers/adminController.js");
const { authenticateToken, requireAdmin } = require("../viable/authMiddleware");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Delete any user's post (admin only)
router.delete("/:id", deleteUserPost);

module.exports = router;
