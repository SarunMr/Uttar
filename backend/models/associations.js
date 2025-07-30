const Question = require("./Question");
const Tag = require("./Tag");
const User = require("./User");

Question.belongsTo(User, { as: "author", foreignKey: "authorId" });

// Use a different alias to avoid collision with the 'tags' attribute
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

module.exports = { Question, Tag, User };
