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

// Get questions by current user (for My Posts page)
async function getMyQuestions(req, res) {
  try {
    const userId = req.user.id; // From auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    // Build search condition
    const searchCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { content: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Question.findAndCountAll({
      where: {
        authorId: userId,
        ...searchCondition,
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "username", "email"],
        },
        {
          model: Comment,
          as: "questionComments",
          attributes: ["id"],
          required: false, // FIXED: Added required: false
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    // Format response
    const questions = rows.map((question) => ({
      id: question.id,
      title: question.title,
      description: question.description,
      content: question.content,
      tags: question.tags,
      images: question.images,
      views: question.views || 0,
      likes: question.likes || 0,
      commentsCount: question.questionComments?.length || 0,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: question.author,
    }));

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching my questions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your questions",
    });
  }
}

// Update question (only by author)
async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, content, tags } = req.body;

    // Find question and verify ownership
    const question = await Question.findOne({
      where: { id, authorId: userId },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found or you do not have permission to edit it",
      });
    }

    // Handle new images if uploaded
    let updatedImages = question.images || [];
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `/uploads/questions/${file.filename}`,
      );
      updatedImages = [...updatedImages, ...newImagePaths];
    }

    // Update question
    await question.update({
      title: title || question.title,
      description: description || question.description,
      content: content || question.content,
      tags: tags || question.tags,
      images: updatedImages,
    });

    // Fetch updated question with author info
    const updatedQuestion = await Question.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "username"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update question",
    });
  }
}

// Delete question (only by author)
async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find question and verify ownership
    const question = await Question.findOne({
      where: { id, authorId: userId },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found or you do not have permission to delete it",
      });
    }

    // FIXED: Use Comment instead of QuestionComment
    await Comment.destroy({
      where: { questionId: id },
    });

    // Delete the question
    await question.destroy();

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
}

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // This was missing!
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    console.log(`getQuestions called with limit: ${limit}, page: ${page}`);

    // Build search condition if search parameter is provided
    const searchCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { content: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Question.findAndCountAll({
      where: searchCondition,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "firstName", "lastName"],
        },
        {
          model: Comment,
          as: "questionComments",
          attributes: ["id"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit, // Apply the limit
      offset, // Apply the offset for pagination
      distinct: true,
    });

    console.log(`Returning ${rows.length} questions (requested limit: ${limit})`);

    const transformedQuestions = rows.map((question) => {
      const questionData = question.toJSON();
      return {
        ...questionData,
        tags: questionData.tags || [],
        likes: Math.max(0, questionData.likes || 0),
        views: Math.max(0, questionData.views || 0),
        commentsCount: questionData.questionComments?.length || 0,
        author: questionData.author || {
          id: questionData.authorId,
          username: "Unknown",
          firstName: "Unknown",
          lastName: "User",
        },
      };
    });

    res.json({ 
      success: true, 
      data: transformedQuestions,
      // Include pagination info for better frontend handling
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// FIXED: Fetch question by id with all details and proper like status for BOTH question and comments
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
            {
              model: CommentLike,
              as: "commentLikes",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "firstName", "lastName"],
                },
              ],
            },
          ],
          order: [["createdAt", "ASC"]],
        },
        // IMPORTANT: Include question likes with user data
        {
          model: QuestionLike,
          as: "questionLikes",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user bookmarked this question
    let isBookmarked = false;
    if (userId) {
      const bookmark = await Bookmark.findOne({
        where: { questionId, userId },
      });
      isBookmarked = !!bookmark;
    }

    // Get actual counts from the included data
    const questionData = question.toJSON();
    const actualQuestionLikeCount = questionData.questionLikes?.length || 0;
    const actualViewCount = await QuestionView.count({ where: { questionId } });

    // Update question with actual counts if they differ
    if (
      question.likes !== actualQuestionLikeCount ||
      question.views !== actualViewCount
    ) {
      await question.update({
        likes: actualQuestionLikeCount,
        views: actualViewCount,
      });
    }

    // Process comments with like data
    const processedComments = questionData.questionComments.map((comment) => {
      const commentLikeCount = comment.commentLikes?.length || 0;

      // Check if current user liked this comment
      const isCommentLikedByUser = userId
        ? comment.commentLikes?.some((like) => like.user.id === userId)
        : false;

      return {
        ...comment,
        likes: commentLikeCount,
        isLiked: isCommentLikedByUser,
      };
    });

    // IMPORTANT: Check if current user liked this QUESTION
    const isQuestionLikedByUser = userId
      ? questionData.questionLikes?.some((like) => like.user.id === userId)
      : false;

    const responseData = {
      ...questionData,
      likes: actualQuestionLikeCount,
      views: actualViewCount,
      isLiked: isQuestionLikedByUser, // This fixes the question like issue
      isBookmarked,
      questionComments: processedComments,
    };

    console.log("=== QUESTION RESPONSE DEBUG ===");
    console.log(`Question ID: ${questionId}`);
    console.log(`User ID: ${userId}`);
    console.log(`Question likes count: ${actualQuestionLikeCount}`);
    console.log(`Question isLiked by user: ${isQuestionLikedByUser}`);
    console.log(
      `Question likes data:`,
      questionData.questionLikes?.map((like) => like.user.id),
    );
    console.log(
      `Comments processed:`,
      processedComments.map((c) => ({
        id: c.id,
        likes: c.likes,
        isLiked: c.isLiked,
      })),
    );
    console.log("=== END DEBUG ===");

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

// FIXED: Get bookmarked questions by current user
async function getBookmarkedQuestions(req, res) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    // Build search condition for questions
    const searchCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { content: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    // FIXED: Proper query to get bookmarked questions
    const { count, rows } = await Question.findAndCountAll({
      where: searchCondition,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "username"],
        },
        {
          model: Comment,
          as: "questionComments",
          attributes: ["id"],
          required: false, // LEFT JOIN
        },
        {
          model: Bookmark,
          as: "bookmarks",
          where: { userId: userId }, // Only get questions bookmarked by current user
          attributes: ["id", "createdAt"],
          required: true, // INNER JOIN - only questions with bookmarks
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    // Format response
    const questions = rows.map((question) => ({
      id: question.id,
      title: question.title,
      description: question.description,
      content: question.content,
      tags: question.tags,
      images: question.images,
      views: question.views || 0,
      likes: question.likes || 0,
      commentsCount: question.questionComments?.length || 0,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: question.author,
      isBookmarked: true, // All returned questions are bookmarked
      bookmarkedAt: question.bookmarks[0]?.createdAt,
    }));

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching bookmarked questions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarked questions",
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

// ENHANCED: Toggle question like with populated response
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

    // ENHANCED: Get populated question data for response
    const populatedQuestion = await Question.findByPk(questionId, {
      include: [
        {
          model: QuestionLike,
          as: "questionLikes",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
      transaction,
    });

    await transaction.commit();

    const response = {
      success: true,
      message: isLiked ? "Question liked" : "Like removed",
      isLiked,
      likes: newLikeCount,
      question: populatedQuestion, // Include populated question data
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
  getMyQuestions,
  updateQuestion,
  deleteQuestion,
  toggleQuestionLike,
  toggleBookmark,
  trackQuestionView,
  getBookmarkedQuestions,
};
