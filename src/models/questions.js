'use strict';

const questionsModel = (sequelize, DataTypes) => sequelize.define('Question', {
  survey_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Surveys',
      key: 'id',
      onDelete: 'CASCADE',
    },
  },
  qIndex: { // index of survey question (0, 1, or 2)
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responseType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  multiChoiceOptions: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = questionsModel;
