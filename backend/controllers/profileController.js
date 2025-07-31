const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get current user profile
async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"], // Don't send password
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
}

// Update user profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      username,
      email,
      gender,
      currentPassword,
      newPassword,
    } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set new password",
        });
      }

      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }
    }

    // Check if username/email already exists (excluding current user)
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        where: { username, id: { [require("sequelize").Op.ne]: userId } },
      });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email, id: { [require("sequelize").Op.ne]: userId } },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update user data
    const updateData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      username: username || user.username,
      email: email || user.email,
      gender: gender || user.gender,
    };

    // Add password to update if provided
    if (newPassword) {
      updateData.password = newPassword; // Will be hashed by the beforeUpdate hook
    }

    await user.update(updateData);

    // Return updated user (excluding password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle validation errors
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}

// Delete user account
async function deleteAccount(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { password, confirmText } = req.body;

    // Validate confirmation text
    if (confirmText !== "DELETE") {
      return res.status(400).json({
        success: false,
        message: 'Please type "DELETE" to confirm',
      });
    }

    // Find user and verify password
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Soft delete approach - anonymize user's content
    // Update questions to show "Deleted User"
    await Question.update(
      {
        authorId: null, // Or set to a special "deleted" user ID
        // Optionally add a deletedAuthor field to preserve original author info for admin purposes
      },
      {
        where: { authorId: userId },
        transaction,
      },
    );

    // Update comments to show "Deleted User"
    await Comment.update(
      {
        authorId: null, // Or set to a special "deleted" user ID
      },
      {
        where: { authorId: userId },
        transaction,
      },
    );

    // Delete user's personal data
    await QuestionLike.destroy({ where: { userId }, transaction });
    await CommentLike.destroy({ where: { userId }, transaction });
    await QuestionView.destroy({ where: { userId }, transaction });
    await Bookmark.destroy({ where: { userId }, transaction });

    // Finally delete the user
    await user.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount, // Add this
};
