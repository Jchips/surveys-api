'use strict';

const { db } = require('../auth/models');
const { DataTypes } = require('sequelize');
const { User } = require('../auth/models');
const responseModel = require('./response');
const surveyModel = require('./survey');
const removedModel = require('./remove');
const questionsModel = require('./questions');
const responderModel = require('./responders');

const Response = responseModel(db, DataTypes);
const Survey = surveyModel(db, DataTypes);
const Remove = removedModel(db, DataTypes);
const Question = questionsModel(db, DataTypes);
const Responder = responderModel(db, DataTypes);

// One-to-many relations
// (User--Survey)
User.hasMany(Survey, {
  foreignKey: 'createdBy', onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Survey.belongsTo(User, {
  foreignKey: 'createdBy', onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User--Responder relation
User.hasMany(Responder, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Responder.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User--Removes relation
User.hasMany(Remove, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Remove.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Survey--Response relation
Survey.hasMany(Response, {
  foreignKey: 'surveyId', onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Response.belongsTo(Survey, {
  foreignKey: 'surveyId', onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Survey--Question relation
Survey.hasMany(Question, {
  foreignKey: 'survey_id',
  as: 'qs',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Question.belongsTo(Survey, {
  foreignKey: 'survey_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Survey--Responder relation
Survey.hasMany(Responder, {
  foreignKey: 'survey_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Responder.belongsTo(Survey, {
  foreignKey: 'survey_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Survey--Removes relation
Survey.hasMany(Remove, {
  foreignKey: 'survey_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Remove.belongsTo(Survey, {
  foreignKey: 'survey_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = {
  Response,
  Survey,
  Remove,
  Question,
  Responder,
};
