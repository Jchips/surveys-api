'use strict';

const responseModel = (sequelize, DataTypes) => sequelize.define('Response', {
  surveyId: {
    type: DataTypes.INTEGER,
    required: true,
  },
  response: {
    type: DataTypes.JSONB,
    required: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = responseModel;
