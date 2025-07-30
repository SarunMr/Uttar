const { DataTypes } = require("sequelize");
const { sequelize } = require("../viable/db");

const CommentLike = sequelize.define(
  "CommentLike",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Comments", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["commentId", "userId"], // Prevent duplicate likes
      },
    ],
  },
);

module.exports = CommentLike;
