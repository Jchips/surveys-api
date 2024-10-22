'use strict';

const surveyModel = (sequelize, DataTypes) => {
  return sequelize.define('Survey', {
    createdBy: {
      type: DataTypes.STRING,
      required: true,
      foreignKey: true,
      references: {
        model: 'Users',
        key: 'username',
      },
    },
    title: {
      type: DataTypes.STRING,
      required: true,
    },
  });
};

module.exports = surveyModel;
