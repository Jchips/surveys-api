'use strict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./user');

// for PostgreSQL db instead:
// const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;
// const sequelize = new Sequelize(DATABASE_URL);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const User = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  User,
};
