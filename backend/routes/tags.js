const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../viable/authMiddleware");
const {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");
const { tagValidationRules } = require("../viable/validators");

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

router.get("/", getAllTags);
router.post("/", tagValidationRules, createTag);
router.put("/:id", tagValidationRules, updateTag);
router.delete("/:id", deleteTag);

module.exports = router;
