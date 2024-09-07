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
    questions: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      required: true,
    },
    responders: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      required: false,
    },
  });
};

module.exports = surveyModel;
