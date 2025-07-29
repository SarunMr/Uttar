const { DataTypes } = require("sequelize");
const { sequelize } = require("../viable/db");

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isSpecial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "tags",
    timestamps: true,
  },
);

module.exports = Tag;
