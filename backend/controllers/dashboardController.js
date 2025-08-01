
const Question = require("../models/Question");
const Comment = require("../models/Comment");
const QuestionLike = require("../models/QuestionLike");
const QuestionView = require("../models/QuestionView");
const Bookmark = require("../models/Bookmark");
const User = require("../models/User");

// Get dashboard statistics
async function getDashboardStats(req, res) {
  try {
    const userId = req.user.id;

    // Get all statistics in parallel
    const [
      totalQuestions,
      totalLikes,
      totalViews,
      totalComments,
      myQuestions,
      bookmarkedQuestions,
    ] = await Promise.all([
      Question.count(),
      QuestionLike.count(),
      QuestionView.count(),
      Comment.count(),
      Question.count({ where: { authorId: userId } }),
      Bookmark.count({ where: { userId: userId } }),
    ]);

    res.json({
      success: true,
      data: {
        totalQuestions,
        totalLikes,
        totalViews,
        totalComments,
        myQuestions,
        bookmarkedQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
}

module.exports = {
  getDashboardStats,
};
