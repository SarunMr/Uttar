const { validationResult } = require("express-validator");
const Tag = require("../models/Tag");

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error("Get all tags error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tags." });
  }
};

// Create new tag
const createTag = async (req, res) => {
  try {
    // Validation errors from express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description } = req.body;

    // Special tags protection
    if (["admin", "request"].includes(name.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: `"${name}" is a protected special tag and cannot be created here.`,
      });
    }

    // Check duplicate
    const existing = await Tag.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Tag with this name already exists.",
      });
    }

    // Create tag
    const tag = await Tag.create({
      name,
      description,
      isSpecial: false,
    });

    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    console.error("Create tag error:", error);
    res.status(500).json({ success: false, message: "Failed to create tag." });
  }
};

// Update existing tag
const updateTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const { name, description } = req.body;

    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res
        .status(404)
        .json({ success: false, message: "Tag not found." });
    }

    // Protect special tags
    if (tag.isSpecial) {
      return res.status(403).json({
        success: false,
        message: "Special tags cannot be updated.",
      });
    }

    // Check if new name conflicts with any other tag
    if (name && name.toLowerCase() !== tag.name.toLowerCase()) {
      const duplicate = await Tag.findOne({ where: { name } });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another tag already has this name.",
        });
      }
    }

    // Update
    tag.name = name;
    tag.description = description;
    await tag.save();

    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    console.error("Update tag error:", error);
    res.status(500).json({ success: false, message: "Failed to update tag." });
  }
};

// Delete tag
const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res
        .status(404)
        .json({ success: false, message: "Tag not found." });
    }

    if (tag.isSpecial) {
      return res.status(403).json({
        success: false,
        message: "Special tags cannot be deleted.",
      });
    }

    await tag.destroy();
    res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully." });
  } catch (error) {
    console.error("Delete tag error:", error);
    res.status(500).json({ success: false, message: "Failed to delete tag." });
  }
};

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};
