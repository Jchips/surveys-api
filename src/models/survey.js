'use strict';

const surveyModel = (sequelize, DataTypes) => {
  return sequelize.define('Survey', {
    uid: {
      type: DataTypes.INTEGER,
      required: true,
    },
    title: {
      type: DataTypes.STRING,
      required: true,
    },
    questions: {
      type: DataTypes.JSON,
      required: true,
    },
  });
};

module.exports = surveyModel;
