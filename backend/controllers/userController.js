const User = require("../models/User");
const Question = require("../models/Question");
const Comment = require("../models/Comment");
const QuestionLike = require("../models/QuestionLike");
const QuestionView = require("../models/QuestionView");
const { Op } = require("sequelize");

// Search users (public version - no admin-only info)
async function searchUsersPublic(req, res) {
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
              [Op.ne]: currentUserId, // Exclude current user from search
            },
          },
          {
            isActive: true, // Only show active users
          },
          {
            [Op.or]: [
              { username: { [Op.iLike]: `%${searchTerm}%` } },
              { firstName: { [Op.iLike]: `%${searchTerm}%` } },
              { lastName: { [Op.iLike]: `%${searchTerm}%` } },
            ],
          },
        ],
      },
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "role",
        "isActive",
        "createdAt",
        // Excluded email for privacy
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
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

// Get user profile (public version)
async function getUserProfilePublic(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        isActive: true, // Only show active users
      },
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "role",
        "isActive",
        "createdAt",
        // Excluded email and other sensitive info
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user statistics (same as admin version)
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

// Get user's posts (public version)
async function getUserPostsPublic(req, res) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Verify user exists and is active
    const user = await User.findOne({
      where: { id, isActive: true },
    });

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

module.exports = {
  searchUsersPublic,
  getUserProfilePublic,
  getUserPostsPublic,
};
