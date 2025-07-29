
// routes/upload.js
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

// Helper function to upload a single image buffer to Cloudinary as a Promise
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "questions" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });

router.post(
  "/images",
  upload.array("images", 5), // Max 5 images per request
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No images uploaded" });
      }

      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
      const imageUrls = await Promise.all(uploadPromises);

      res.status(200).json({ success: true, data: imageUrls });
    } catch (error) {
      console.error("Image upload failure:", error);
      res.status(500).json({ success: false, message: "Failed to upload images" });
    }
  }
);

module.exports = router;
