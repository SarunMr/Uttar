
const Question = require("../models/Question");
const Tag = require("../models/Tag");

// Create a new question with uploaded images
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, content, tags } = req.body;
    
    // Validate tags exist (replace with your tag model logic if needed)
    const foundTags = await Tag.findAll({ where: { name: tags } });
    if (foundTags.length !== tags.length) {
      return res.status(400).json({ 
        success: false, 
        message: "One or more tags do not exist." 
      });
    }
    
    // Handle images uploaded by multer
    const images = req.files ? req.files.map(file => `/uploads/questions/${file.filename}`) : [];
    
    // Create question
    const question = await Question.create({
      title,
      description,
      content,
      images,
      tags, // storing tags array for simplicity
      authorId: req.user.id, // assuming user id is from auth middleware
    });
    
    // If you want normalized tags with many-to-many association: attach tags here
    // await question.setTags(foundTags);

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({ success: false, message: "Server error creating question." });
  }
};

// Fetch all questions with author and tags included
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [
        { model: require("../models/User"), as: "author", attributes: ["id", "username", "firstName", "lastName"] },
        // Note: if you normalized tags as separate model and association use:
        // { model: Tag, as: "tags", attributes: ["name"] }
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Fetch question by id with author and tags
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        { model: require("../models/User"), as: "author", attributes: ["id", "username", "firstName", "lastName"] },
      ],
    });
    if (!question) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
