const Question = require("../models/Question");
const Comment = require("../models/Comment");
const QuestionLike = require("../models/QuestionLike");
const CommentLike = require("../models/CommentLike");
const QuestionView = require("../models/QuestionView");
const Bookmark = require("../models/Bookmark");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { Op } = require("sequelize");
const { sequelize } = require("../viable/db.js");

// Create a new question with uploaded images
async function createQuestion(req, res) {
  try {
    const { title, description, content } = req.body;
    let { tags } = req.body;

    // Handle different tag formats
    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = [tags];
      }
    }

    if (!Array.isArray(tags)) {
      tags = tags ? [tags] : [];
    }

    // Validate tags exist in your Tag model
    if (tags.length > 0) {
      const foundTags = await Tag.findAll({ where: { name: tags } });
      const foundTagNames = foundTags.map((tag) => tag.name);

      const invalidTags = tags.filter((tag) => !foundTagNames.includes(tag));
      if (invalidTags.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid tags: ${invalidTags.join(", ")}. Please select valid tags.`,
        });
      }
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/questions/${file.filename}`)
      : [];

    // Create question with tags array
    const question = await Question.create({
      title,
      description,
      content,
      images,
      tags, // Store as array
      authorId: req.user.id,
      likes: 0, // Initialize likes to 0
      views: 0, // Initialize views to 0
      commentsCount: 0, // Initialize comments count
    });

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating question",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}

// Fetch all questions with author included
async function getQuestions(req, res) {
  try {
    const questions = await Question.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const transformedQuestions = questions.map((question) => {
      const questionData = question.toJSON();
      return {
        ...questionData,
        tags: questionData.tags || [],
        likes: Math.max(0, questionData.likes || 0),
        views: Math.max(0, questionData.views || 0),
        commentsCount: Math.max(0, questionData.commentsCount || 0),
        author: questionData.author || {
          id: questionData.authorId,
          username: "Unknown",
          firstName: "Unknown",
          lastName: "User",
        },
      };
    });

    res.json({ success: true, data: transformedQuestions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// FIXED: Fetch question by id with all details and proper like status
async function getQuestion(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user?.id;

    console.log(`Getting question ${questionId} for user ${userId}`);

    const question = await Question.findByPk(questionId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "firstName", "lastName"],
        },
        {
          model: Comment,
          as: "questionComments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "firstName", "lastName"],
            },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Initialize user-specific data
    let userQuestionLike = null;
    let isBookmarked = false;
    let commentLikes = {};

    if (userId) {
      // Check if user liked this question
      userQuestionLike = await QuestionLike.findOne({
        where: { questionId, userId },
      });

      console.log(`User question like found: ${!!userQuestionLike}`);

      // Check if user bookmarked this question
      const bookmark = await Bookmark.findOne({
        where: { questionId, userId },
      });
      isBookmarked = !!bookmark;

      // Get user's comment likes
      if (question.questionComments.length > 0) {
        const commentIds = question.questionComments.map((c) => c.id);
        const userCommentLikes = await CommentLike.findAll({
          where: { commentId: commentIds, userId },
        });

        userCommentLikes.forEach((cl) => {
          commentLikes[cl.commentId] = true;
        });

        console.log(`Comment likes for user:`, commentLikes);
      }
    }

    // FIXED: Get actual counts and sync with database
    const actualLikeCount = await QuestionLike.count({ where: { questionId } });
    const actualViewCount = await QuestionView.count({ where: { questionId } });

    // Update question with actual counts if they differ
    if (
      question.likes !== actualLikeCount ||
      question.views !== actualViewCount
    ) {
      await question.update({
        likes: actualLikeCount,
        views: actualViewCount,
      });
    }

    // Process comments with actual like counts
    const updatedComments = await Promise.all(
      question.questionComments.map(async (comment) => {
        const actualCommentLikes = await CommentLike.count({
          where: { commentId: comment.id },
        });

        // Update comment if like count differs
        if (comment.likes !== actualCommentLikes) {
          await comment.update({ likes: actualCommentLikes });
        }

        return {
          ...comment.toJSON(),
          likes: actualCommentLikes,
          isLiked: !!commentLikes[comment.id],
        };
      }),
    );

    // FIXED: Build response with proper like status
    const responseData = {
      ...question.toJSON(),
      likes: actualLikeCount,
      views: actualViewCount,
      isLiked: !!userQuestionLike, // This is the key fix
      isBookmarked,
      questionComments: updatedComments,
    };

    console.log(
      `Sending response - Question isLiked: ${responseData.isLiked}, likes: ${responseData.likes}`,
    );

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// Track question view (separate endpoint)
async function trackQuestionView(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to track views",
      });
    }

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Use findOrCreate to prevent duplicate views from same user
    const [viewRecord, wasCreated] = await QuestionView.findOrCreate({
      where: { questionId, userId },
      defaults: { questionId, userId },
    });

    if (wasCreated) {
      // Only increment if this is a new view
      const viewCount = await QuestionView.count({ where: { questionId } });
      await question.update({ views: viewCount });

      res.json({
        success: true,
        message: "View tracked",
        views: viewCount,
      });
    } else {
      // Return current view count without incrementing
      res.json({
        success: true,
        message: "View already tracked",
        views: question.views,
      });
    }
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// FIXED: Toggle question like with proper transaction handling
async function toggleQuestionLike(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    console.log(
      `Toggle question like - QuestionID: ${questionId}, UserID: ${userId}`,
    );

    const question = await Question.findByPk(questionId, { transaction });
    if (!question) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const existingLike = await QuestionLike.findOne({
      where: { questionId, userId },
      transaction,
    });

    console.log(`Existing question like found: ${!!existingLike}`);

    let isLiked;
    let newLikeCount;

    if (existingLike) {
      // Remove like
      await existingLike.destroy({ transaction });
      isLiked = false;
      console.log("Question like removed");
    } else {
      // Add like
      await QuestionLike.create({ questionId, userId }, { transaction });
      isLiked = true;
      console.log("Question like added");
    }

    // Get actual count from database within transaction
    newLikeCount = await QuestionLike.count({
      where: { questionId },
      transaction,
    });

    console.log(`New question like count: ${newLikeCount}`);

    // Update question with actual count
    await question.update({ likes: newLikeCount }, { transaction });

    await transaction.commit();

    const response = {
      success: true,
      message: isLiked ? "Question liked" : "Like removed",
      isLiked,
      likes: newLikeCount,
    };

    console.log("Question like response:", response);
    res.json(response);
  } catch (error) {
    await transaction.rollback();
    console.error("Error toggling question like:", error);

    // Handle unique constraint violations
    if (error.name === "SequelizeUniqueConstraintError") {
      console.error(
        "Unique constraint violation - user might have tried to like twice",
      );
      return res.status(409).json({
        success: false,
        message: "Like action already in progress",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Toggle bookmark
async function toggleBookmark(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    const question = await Question.findByPk(questionId, { transaction });
    if (!question) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const existingBookmark = await Bookmark.findOne({
      where: { questionId, userId },
      transaction,
    });

    let isBookmarked;

    if (existingBookmark) {
      await existingBookmark.destroy({ transaction });
      isBookmarked = false;
    } else {
      await Bookmark.create({ questionId, userId }, { transaction });
      isBookmarked = true;
    }

    await transaction.commit();

    res.json({
      success: true,
      message: isBookmarked ? "Question bookmarked" : "Bookmark removed",
      isBookmarked,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Export all functions
module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  trackQuestionView,
  toggleQuestionLike,
  toggleBookmark,
};
