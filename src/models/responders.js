'use strict';

const respondersModel = (sequelize, DataTypes) => sequelize.define('Responder', {
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  survey_id: {
    type: DataTypes.INTEGER,
    required: true,
    references: {
      model: 'Surveys',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});

module.exports = respondersModel;
