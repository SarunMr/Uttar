const { DataTypes } = require("sequelize");
const { sequelize } = require("../viable/db");

const QuestionLike = sequelize.define(
  "QuestionLike",
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
        fields: ["questionId", "userId"], // Prevent duplicate likes
      },
    ],
  },
);

module.exports = QuestionLike;
