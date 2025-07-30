const Comment = require("../models/Comment");
const CommentLike = require("../models/CommentLike");
const Question = require("../models/Question");
const User = require("../models/User");

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId; // Now from route params
    const userId = req.user.id;

    // Check if question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      questionId,
      authorId: userId,
    });

    // Update question comments count
    await question.increment("commentsCount");

    // Get comment with author info
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: {
        ...commentWithAuthor.toJSON(),
        isLiked: false, // New comment, user hasn't liked it yet
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.authorId !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to edit this comment",
        });
    }

    // Update comment
    await comment.update({ content });

    // Check if user liked this comment
    const userLike = await CommentLike.findOne({
      where: { commentId, userId },
    });

    res.json({
      success: true,
      data: {
        ...comment.toJSON(),
        isLiked: !!userLike,
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.authorId !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this comment",
        });
    }

    // Get question to update comment count
    const question = await Question.findByPk(comment.questionId);

    // Delete comment (this will also delete associated likes due to cascade)
    await comment.destroy();

    // Update question comments count
    if (question) {
      await question.decrement("commentsCount");
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle comment like
exports.toggleCommentLike = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    // Check if comment exists
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if user already liked
    const existingLike = await CommentLike.findOne({
      where: { commentId, userId },
    });

    if (existingLike) {
      // Remove like
      await existingLike.destroy();
      await comment.decrement("likes");

      res.json({
        success: true,
        message: "Like removed",
        isLiked: false,
        likes: comment.likes - 1,
      });
    } else {
      // Add like
      await CommentLike.create({ commentId, userId });
      await comment.increment("likes");

      res.json({
        success: true,
        message: "Comment liked",
        isLiked: true,
        likes: comment.likes + 1,
      });
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
