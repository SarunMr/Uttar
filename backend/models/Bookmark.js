const { DataTypes } = require("sequelize");
const { sequelize } = require("../viable/db");

const Bookmark = sequelize.define(
  "Bookmark",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Questions", key: "id" },
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
        fields: ["questionId", "userId"], // Prevent duplicate bookmarks
      },
    ],
  },
);

module.exports = Bookmark;
