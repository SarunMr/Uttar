const { DataTypes } = require("sequelize");
const sequelize = require("../viable/db"); // Adjust as per your setup

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of image URLs
    allowNull: true,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// Associations: User (author) and Tag (many-to-many)
Question.associate = function (models) {
  Question.belongsTo(models.User, { as: "author", foreignKey: "authorId" });
  Question.belongsToMany(models.Tag, {
    through: "QuestionTags",
    as: "tags",
    foreignKey: "questionId",
  });
};

module.exports = Question;
