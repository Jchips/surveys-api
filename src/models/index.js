'use strict';

const { db } = require('../auth/models');
const { DataTypes } = require('sequelize');
const { User } = require('../auth/models');
const responseModel = require('./response');
const surveyModel = require('./survey');

const Response = responseModel(db, DataTypes);
const Survey = surveyModel(db, DataTypes);

// One-to-many relation
User.hasOne(Survey, { foreignKey: 'uid', as: 'createdSurveys' });
Survey.belongsTo(User, { foreignKey: 'uid' });

Survey.hasOne(Response, { foreignKey: 'survey_id', as: 'responses' });
Response.belongsTo(Survey, { foreignKey: 'survey_id' });


module.exports = {
  Response,
  Survey,
};
