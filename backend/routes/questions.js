// routes/questions.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../viable/authMiddleware");
const { createQuestion } = require("../controllers/questionController");
const { createQuestionRules } = require("../viable/validators");
const { validateRequest } = require("../viable/validateRequest");

// POST /api/questions - Create a new question (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createQuestionRules,
  validateRequest,
  createQuestion,
);

// TODO: Add other routes like GET question(s), etc.

module.exports = router;
