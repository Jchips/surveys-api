'use strict';

const responseModel = (sequelize, DataTypes) => sequelize.define('Response', {
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  response: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = responseModel;
