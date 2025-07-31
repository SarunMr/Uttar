const Comment = require("../models/Comment");
const CommentLike = require("../models/CommentLike");
const Question = require("../models/Question");
const User = require("../models/User");
// Import sequelize instance - adjust this path to match your database connection file
const { sequelize } = require("../viable/db.js"); // or wherever your sequelize instance is

// Create comment
async function createComment(req, res) {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId;
    const userId = req.user.id;

    // Check if question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Create comment with initial likes set to 0
    const comment = await Comment.create({
      content,
      questionId,
      authorId: userId,
      likes: 0, // Initialize likes to 0
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
        likes: 0, // Ensure starts at 0
        isLiked: false,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Update comment
async function updateComment(req, res) {
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
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    await comment.update({ content });

    // Check if user liked this comment
    const userLike = await CommentLike.findOne({
      where: { commentId, userId },
    });

    // Get actual like count
    const actualLikeCount = await CommentLike.count({ where: { commentId } });

    // Update comment with actual count if different
    if (comment.likes !== actualLikeCount) {
      await comment.update({ likes: actualLikeCount });
    }

    res.json({
      success: true,
      data: {
        ...comment.toJSON(),
        likes: actualLikeCount,
        isLiked: !!userLike,
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Delete comment
async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    const question = await Question.findByPk(comment.questionId);

    // Delete comment and associated likes
    await comment.destroy();

    if (question) {
      await question.decrement("commentsCount");
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function toggleCommentLike(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    console.log(
      `Toggle comment like - CommentID: ${commentId}, UserID: ${userId}`,
    );

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const existingLike = await CommentLike.findOne({
      where: { commentId, userId },
    });

    console.log(`Existing comment like found: ${!!existingLike}`);

    let isLiked;
    if (existingLike) {
      // Remove like
      await existingLike.destroy();
      isLiked = false;
      console.log("Comment like removed");
    } else {
      // Add like
      await CommentLike.create({ commentId, userId });
      isLiked = true;
      console.log("Comment like added");
    }

    // Get actual count from database
    const actualCount = await CommentLike.count({ where: { commentId } });
    console.log(`Actual comment like count: ${actualCount}`);

    // Update comment with actual count
    await comment.update({ likes: actualCount });

    const response = {
      success: true,
      message: isLiked ? "Comment liked" : "Like removed",
      isLiked,
      likes: actualCount,
    };

    console.log("Comment like response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
