
const { body } = require("express-validator");

const createQuestionRules = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 10, max: 150 }).withMessage("Title must be between 10 and 150 characters"),
  body("description")
    .notEmpty().withMessage("Description is required")
    .isLength({ max: 255 }).withMessage("Description max length is 255"),
  body("content")
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 20 }).withMessage("Content must be at least 20 characters"),
  body("tags")
    .isArray({ min: 1, max: 5 }).withMessage("Provide 1 to 5 tags")
    .custom(tags => tags.every(tag => typeof tag === "string"))
];

module.exports = { createQuestionRules };
