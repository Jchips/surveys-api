'use strict';

const surveyModel = (sequelize, DataTypes) => {
  return sequelize.define('Survey', {
    createdBy: {
      type: DataTypes.STRING,
      required: true,
    },
    title: {
      type: DataTypes.STRING,
      required: true,
    },
  });
};

module.exports = surveyModel;
