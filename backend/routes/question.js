const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  createQuestion,
  getQuestions,
  getQuestion,
  toggleQuestionLike,
  toggleBookmark,
} = require("../controllers/questionController");
const { createQuestionRules } = require("../viable/questionValidator");
const validateRequest = require("../viable/validateRequest");
const { authenticateToken } = require("../viable/authMiddleware");

// Create new question with image upload
router.post(
  "/",
  authenticateToken,
  upload.array("images", 5), // Accept up to 5 images
  createQuestionRules,
  validateRequest,
  createQuestion,
);

// Fetch all questions
router.get("/", getQuestions);

// Fetch one question by id
router.get("/:id", getQuestion);

// Toggle question like
router.post("/:id/like", authenticateToken, toggleQuestionLike);

// Toggle bookmark
router.post("/:id/bookmark", authenticateToken, toggleBookmark);

module.exports = router;
