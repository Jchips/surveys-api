'use strict';

const questionsModel = (sequelize, DataTypes) => sequelize.define('Question', {
  survey_id: {
    type: DataTypes.INTEGER,
    required: true,
    references: {
      model: 'Surveys',
      key: 'id',
      onDelete: 'CASCADE',
    },
  },
  qIndex: { // index of survey question (0, 1, or 2)
    type: DataTypes.INTEGER,
    required: true,
  },
  question: {
    type: DataTypes.STRING,
    required: true,
  },
  responseType: {
    type: DataTypes.STRING,
    required: true,
  },
  multiChoiceOptions: {
    type: DataTypes.STRING,
    required: false,
  },
});

module.exports = questionsModel;
