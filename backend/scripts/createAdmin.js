require('dotenv').config();

const { sequelize } = require('../viable/db');
const User = require('../models/User');
const Tag = require('../models/Tag'); // make sure you import Tag model

(async () => {
  try {
    await sequelize.sync();
    
    // Get admin credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin123@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123";
    console.log(ADMIN_EMAIL, ADMIN_PASSWORD);
    
    // Check if admin already exists
    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log("Admin already exists:", ADMIN_EMAIL);
    } else {
      // Create admin user
      const admin = await User.create({
        firstName: "Admin",
        lastName: "User",
        username: "admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        gender: "other",
        role: "admin",
        isActive: true
      });
      console.log("Admin created:", admin.email);
    }

    // Ensure special tags exist
    await Tag.findOrCreate({
      where: { name: 'admin' },
      defaults: {
        description:
          'Special tag for admin panel only - used for administrative purposes and internal discussions',
        isSpecial: true,
      },
    });

    await Tag.findOrCreate({
      where: { name: 'request' },
      defaults: {
        description:
          'Special tag for user requests - handles feature requests and user feedback',
        isSpecial: true,
      },
    });

    console.log("Special tags ensured: admin, request");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user or tags:", error);
    process.exit(1);
  }
})();
