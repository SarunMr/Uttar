// controllers/questionController.js
const { Question, Tag } = require("../models");

exports.createQuestion = async (req, res) => {
  try {
    const { title, description, content, images, tagNames } = req.body;

    // Validate tags exist
    const tags = await Tag.findAll({ where: { name: tagNames } });
    if (tags.length !== tagNames.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more tags do not exist. Please check the tags section.",
      });
    }

    // Create question linked to user from auth middleware (req.user)
    const question = await Question.create({
      title,
      description,
      content,
      images,
      authorId: req.user.id,
    });

    // Attach tags
    await question.setTags(tags);

    // Retrieve question with tags included for response if needed
    const createdQuestion = await Question.findByPk(question.id, {
      include: [{ model: Tag, as: "tags" }],
    });

    res.status(201).json({ success: true, data: createdQuestion });
  } catch (error) {
    console.error("Create question error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error creating question." });
  }
};
