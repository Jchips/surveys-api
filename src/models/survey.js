'use strict';

const surveyModel = (sequelize, DataTypes) => {
  return sequelize.define('Survey', {
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
      references: {
        model: 'Users',
        key: 'username',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = surveyModel;
