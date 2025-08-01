const User = require("../models/User");
const Question = require("../models/Question");
const Comment = require("../models/Comment");
const QuestionLike = require("../models/QuestionLike");
const QuestionView = require("../models/QuestionView");
const Bookmark = require("../models/Bookmark");
const { Op } = require("sequelize");
const { sequelize } = require("../viable/db");

// Search users by username, email, or name
async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long",
      });
    }

    const searchTerm = q.trim();

    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.ne]: currentUserId, // Exclude current admin user from search
            },
          },
          {
            [Op.or]: [
              { username: { [Op.iLike]: `%${searchTerm}%` } },
              { email: { [Op.iLike]: `%${searchTerm}%` } },
              { firstName: { [Op.iLike]: `%${searchTerm}%` } },
              { lastName: { [Op.iLike]: `%${searchTerm}%` } },
              sequelize.where(
                sequelize.fn(
                  "CONCAT",
                  sequelize.col("firstName"),
                  " ",
                  sequelize.col("lastName"),
                ),
                { [Op.iLike]: `%${searchTerm}%` },
              ),
            ],
          },
        ],
      },
      attributes: {
        exclude: ["password"], // Never send password
      },
      order: [["createdAt", "DESC"]],
      limit: 20, // Limit search results
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
}

// Get detailed user profile
async function getUserProfile(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"], // Never send password
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user statistics
    const [questionCount, totalLikes, totalViews, totalComments] =
      await Promise.all([
        Question.count({ where: { authorId: id } }),
        QuestionLike.count({
          include: [
            {
              model: Question,
              as: "question",
              where: { authorId: id },
              attributes: [],
            },
          ],
        }),
        QuestionView.count({
          include: [
            {
              model: Question,
              as: "question",
              where: { authorId: id },
              attributes: [],
            },
          ],
        }),
        Comment.count({ where: { authorId: id } }),
      ]);

    const userWithStats = {
      ...user.toJSON(),
      stats: {
        questionCount,
        totalLikes,
        totalViews,
        totalComments,
      },
    };

    res.json({
      success: true,
      data: userWithStats,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
}

// Get user's posts (questions)
async function getUserPosts(req, res) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Verify user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { count, rows } = await Question.findAndCountAll({
      where: { authorId: id },
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
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    // Format response
    const posts = rows.map((question) => ({
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
      data: posts,
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
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
    });
  }
}

// Delete a user's post (admin only)
async function deleteUserPost(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params; // post ID
    const adminId = req.user.id;

    // Find the post
    const post = await Question.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    if (!post) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Admin cannot delete their own posts through this endpoint (they should use regular delete)
    if (post.authorId === adminId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Use regular delete endpoint for your own posts",
      });
    }

    // Delete related data first
    await Promise.all([
      QuestionLike.destroy({ where: { questionId: id }, transaction }),
      QuestionView.destroy({ where: { questionId: id }, transaction }),
      Bookmark.destroy({ where: { questionId: id }, transaction }),
      Comment.destroy({ where: { questionId: id }, transaction }),
    ]);

    // Delete the post
    await post.destroy({ transaction });

    await transaction.commit();

    // Log admin action (optional - for audit purposes)
    console.log(`Admin ${adminId} deleted post ${id} by user ${post.authorId}`);

    res.json({
      success: true,
      message: `Post "${post.title}" deleted successfully`,
      deletedPost: {
        id: post.id,
        title: post.title,
        author: post.author,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting user post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
}

// Activate user account
async function activateUser(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already active",
      });
    }

    await user.update({ isActive: true });

    // Log admin action
    console.log(`Admin ${adminId} activated user ${id}`);

    res.json({
      success: true,
      message: "User activated successfully",
      data: {
        id: user.id,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to activate user",
    });
  }
}

// Deactivate user account
async function deactivateUser(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating themselves
    if (user.id === adminId) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    // Prevent deactivating other admins (optional security measure)
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot deactivate another admin account",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already inactive",
      });
    }

    await user.update({ isActive: false });

    // Log admin action
    console.log(`Admin ${adminId} deactivated user ${id}`);

    res.json({
      success: true,
      message: "User deactivated successfully",
      data: {
        id: user.id,
        isActive: false,
      },
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate user",
    });
  }
}

// Promote user to admin
async function promoteUser(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "User is already an admin",
      });
    }

    await user.update({ role: "admin" });

    // Log admin action
    console.log(`Admin ${adminId} promoted user ${id} to admin`);

    res.json({
      success: true,
      message: "User promoted to admin successfully",
      data: {
        id: user.id,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to promote user",
    });
  }
}

// Demote admin to user (bonus feature)
async function demoteAdmin(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from demoting themselves
    if (user.id === adminId) {
      return res.status(400).json({
        success: false,
        message: "You cannot demote your own account",
      });
    }

    if (user.role === "user") {
      return res.status(400).json({
        success: false,
        message: "User is already a regular user",
      });
    }

    await user.update({ role: "user" });

    // Log admin action
    console.log(`Admin ${adminId} demoted admin ${id} to user`);

    res.json({
      success: true,
      message: "Admin demoted to user successfully",
      data: {
        id: user.id,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Error demoting admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to demote admin",
    });
  }
}

module.exports = {
  searchUsers,
  getUserProfile,
  getUserPosts,
  deleteUserPost,
  activateUser,
  deactivateUser,
  promoteUser,
  demoteAdmin,
};
