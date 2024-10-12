'use strict';

const removeModel = (sequelize, DataTypes) => sequelize.define('Remove', {
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
    references: {
      model: 'Users', // The table name
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  survey_id: {
    type: DataTypes.INTEGER,
    required: true,
    references: {
      model: 'Surveys', // The table name
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});
module.exports = removeModel;
