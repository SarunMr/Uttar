const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/authController.js");
const { authenticateToken } = require("../viable/authMiddleware");
const { registerValidation, loginValidation } = require("../viable/validators");

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post(
  "/register",
  authLimiter,
  registerValidation,
  authController.register,
);
router.post("/login", authLimiter, loginValidation, authController.login);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
