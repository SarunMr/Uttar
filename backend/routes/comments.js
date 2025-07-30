const express = require("express");
const router = express.Router();
const {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} = require("../controllers/commentController");
const { authenticateToken } = require("../viable/authMiddleware");

// Create comment for a specific question
router.post("/question/:questionId", authenticateToken, createComment);

// Update comment
router.put("/:id", authenticateToken, updateComment);

// Delete comment
router.delete("/:id", authenticateToken, deleteComment);

// Toggle comment like
router.post("/:id/like", authenticateToken, toggleCommentLike);

module.exports = router;
