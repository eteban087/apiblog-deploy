const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  passwordChangeAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_change_at',
  },

  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },

  profileImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    // defaultValue: 'https://randomuser.me/api/portraits/men/40.jpg',
    field: 'profile_img_url',
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = User;
