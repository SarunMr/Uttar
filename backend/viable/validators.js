// viable/validators.js
const { body } = require("express-validator");

const registerValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),

  body("gender")
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Please select a valid gender option"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];
const tagValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tag name is required")
    .isLength({ max: 50 })
    .withMessage("Tag name must be at most 50 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Tag description is required")
    .custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 5) {
        throw new Error("Description must have at least 5 words");
      }
      return true;
    }),
];
const createQuestionRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 10, max: 150 })
    .withMessage("Title must be between 10 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 255 })
    .withMessage("Description max length is 255"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 })
    .withMessage("Content must be at least 20 characters"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of URLs"),

  body("tagNames")
    .isArray({ min: 1, max: 5 })
    .withMessage("Please provide 1 to 5 tags")
    .custom(
      (tags) => Array.isArray(tags) && tags.every((t) => typeof t === "string"),
    ),
];

module.exports = {
  registerValidation,
  loginValidation,
  tagValidationRules,
  createQuestionRules,
};
