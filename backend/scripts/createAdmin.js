
require('dotenv').config();

const { sequelize } = require('../viable/db');
const User = require('../models/User');

(async () => {
  await sequelize.sync();
  const existing = await User.findOne({ where: { email: "admin123@gmail.com" } });
  if (existing) {
    console.log("Admin already exists.");
    process.exit(0);
  }
  const admin = await User.create({
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    email: "admin123@gmail.com",
    password: "Admin123", // Meets validation: 1 uppercase, 1 lowercase, 1 number, >=6 chars
    gender: "other",
    role: "admin",
    isActive: true
  });
  console.log("Admin created:", admin.email);
  process.exit(0);
})();
