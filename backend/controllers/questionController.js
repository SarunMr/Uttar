const Question = require("../models/Question");
const Comment = require("../models/Comment");
const QuestionLike = require("../models/QuestionLike");
const CommentLike = require("../models/CommentLike");
const QuestionView = require("../models/QuestionView");
const Bookmark = require("../models/Bookmark");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { Op } = require("sequelize");

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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

// Fetch question by id with all details
async function getQuestion(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user?.id;

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
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    if (userId) {
      await QuestionView.findOrCreate({
        where: { questionId, userId },
        defaults: { questionId, userId },
      });
    }

    const viewCount = await QuestionView.count({ where: { questionId } });
    await question.update({ views: viewCount });

    let userQuestionLike = null;
    let isBookmarked = false;
    let commentLikes = {};

    if (userId) {
      userQuestionLike = await QuestionLike.findOne({
        where: { questionId, userId },
      });

      const bookmark = await Bookmark.findOne({
        where: { questionId, userId },
      });
      isBookmarked = !!bookmark;

      if (question.questionComments.length > 0) {
        const commentIds = question.questionComments.map((c) => c.id);
        const userCommentLikes = await CommentLike.findAll({
          where: { commentId: commentIds, userId },
        });

        userCommentLikes.forEach((cl) => {
          commentLikes[cl.commentId] = true;
        });
      }
    }

    const responseData = {
      ...question.toJSON(),
      isLiked: !!userQuestionLike,
      isBookmarked,
      questionComments: question.questionComments.map((comment) => ({
        ...comment.toJSON(),
        isLiked: !!commentLikes[comment.id],
      })),
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching question:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

// Toggle question like
async function toggleQuestionLike(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const existingLike = await QuestionLike.findOne({
      where: { questionId, userId },
    });

    if (existingLike) {
      await existingLike.destroy();
      await question.decrement("likes");

      res.json({
        success: true,
        message: "Like removed",
        isLiked: false,
        likes: question.likes - 1,
      });
    } else {
      await QuestionLike.create({ questionId, userId });
      await question.increment("likes");

      res.json({
        success: true,
        message: "Question liked",
        isLiked: true,
        likes: question.likes + 1,
      });
    }
  } catch (error) {
    console.error("Error toggling question like:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Toggle bookmark
async function toggleBookmark(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const existingBookmark = await Bookmark.findOne({
      where: { questionId, userId },
    });

    if (existingBookmark) {
      await existingBookmark.destroy();
      res.json({
        success: true,
        message: "Bookmark removed",
        isBookmarked: false,
      });
    } else {
      await Bookmark.create({ questionId, userId });
      res.json({
        success: true,
        message: "Question bookmarked",
        isBookmarked: true,
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Export all functions
module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  toggleQuestionLike,
  toggleBookmark,
};
