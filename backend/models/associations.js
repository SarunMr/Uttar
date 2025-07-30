
const Question = require("./Question");
const Tag = require("./Tag");
const User = require("./User");

Question.belongsTo(User, { as: "author", foreignKey: "authorId" });
Question.belongsToMany(Tag, { through: "QuestionTags", as: "tags", foreignKey: "questionId" });
Tag.belongsToMany(Question, { through: "QuestionTags", as: "questions", foreignKey: "tagId" });

module.exports = { Question, Tag, User };
