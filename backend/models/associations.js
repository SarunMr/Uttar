const Question = require("./Question");
const Comment = require("./Comment");
const QuestionLike = require("./QuestionLike");
const CommentLike = require("./CommentLike");
const QuestionView = require("./QuestionView");
const Bookmark = require("./Bookmark");
const Tag = require("./Tag");
const User = require("./User");

// Existing associations
Question.belongsTo(User, { as: "author", foreignKey: "authorId" });

// Existing tag associations (keep these)
Question.belongsToMany(Tag, {
  through: "QuestionTags",
  as: "questionTags", // Changed from "tags" to "questionTags"
  foreignKey: "questionId",
});

Tag.belongsToMany(Question, {
  through: "QuestionTags",
  as: "taggedQuestions", // Changed from "questions" to "taggedQuestions"
  foreignKey: "tagId",
});

// NEW: Add these associations for the comment system
Question.hasMany(Comment, { as: "questionComments", foreignKey: "questionId" });
Question.hasMany(QuestionLike, {
  as: "questionLikes",
  foreignKey: "questionId",
});
Question.hasMany(QuestionView, {
  as: "questionViews",
  foreignKey: "questionId",
});
Question.hasMany(Bookmark, { as: "bookmarks", foreignKey: "questionId" });

// Comment associations
Comment.belongsTo(User, { as: "author", foreignKey: "authorId" });
Comment.belongsTo(Question, { as: "question", foreignKey: "questionId" });
Comment.hasMany(CommentLike, { as: "commentLikes", foreignKey: "commentId" });

// User associations
User.hasMany(Question, { as: "questions", foreignKey: "authorId" });
User.hasMany(Comment, { as: "comments", foreignKey: "authorId" });
User.hasMany(QuestionLike, { as: "questionLikes", foreignKey: "userId" });
User.hasMany(CommentLike, { as: "commentLikes", foreignKey: "userId" });
User.hasMany(QuestionView, { as: "views", foreignKey: "userId" });
User.hasMany(Bookmark, { as: "bookmarks", foreignKey: "userId" });

// Like associations
QuestionLike.belongsTo(User, { as: "user", foreignKey: "userId" });
QuestionLike.belongsTo(Question, { as: "question", foreignKey: "questionId" });

CommentLike.belongsTo(User, { as: "user", foreignKey: "userId" });
CommentLike.belongsTo(Comment, { as: "comment", foreignKey: "commentId" });

// View associations
QuestionView.belongsTo(User, { as: "user", foreignKey: "userId" });
QuestionView.belongsTo(Question, { as: "question", foreignKey: "questionId" });

// Bookmark associations
Bookmark.belongsTo(User, { as: "user", foreignKey: "userId" });
Bookmark.belongsTo(Question, { as: "question", foreignKey: "questionId" });

module.exports = {
  Question,
  Comment,
  QuestionLike,
  CommentLike,
  QuestionView,
  Bookmark,
  Tag,
  User,
};
