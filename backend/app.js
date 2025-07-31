const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const { testConnection } = require("./viable/db");

// Import routes
const authRoutes = require("./routes/auth");
const tagRoutes = require("./routes/tags");
const questionRoutes = require("./routes/question.js");
const commentRoutes = require("./routes/comments.js")
const profileRoutes = require("./routes/profile.js")
require("./models/associations.js");

// Create Express app
const app = express();

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(helmet());
app.use(
  cors({
    // CORS configuration
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/comments", commentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

module.exports = app;
