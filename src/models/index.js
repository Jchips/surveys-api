'use strict';

const { db } = require('../auth/models');
const { DataTypes } = require('sequelize');
const { User } = require('../auth/models');
const responseModel = require('./response');
const surveyModel = require('./survey');

const Response = responseModel(db, DataTypes);
const Survey = surveyModel(db, DataTypes);

// One-to-many relation
User.hasOne(Survey, { foreignKey: 'createdBy', as: 'fk_createdBy_username' });
Survey.belongsTo(User, { foreignKey: 'createdBy' });

Survey.hasOne(Response, { foreignKey: 'surveyId', as: 'fk_surveyId_id' });
Response.belongsTo(Survey, { foreignKey: 'surveyId' });

module.exports = {
  Response,
  Survey,
};
