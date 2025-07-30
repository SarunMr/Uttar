const { DataTypes } = require("sequelize");
const { sequelize } = require("../viable/db");

const QuestionView = sequelize.define(
  "QuestionView",
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
      allowNull: true, // Allow anonymous views
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["questionId", "userId"], // One view per user per question
        where: {
          userId: {
            [require("sequelize").Op.ne]: null,
          },
        },
      },
    ],
  },
);

module.exports = QuestionView;
