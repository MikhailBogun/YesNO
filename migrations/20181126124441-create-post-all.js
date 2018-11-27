'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PostAlls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING
      },
      massage: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      yes: {
        type: Sequelize.INTEGER
      },
      no: {
        type: Sequelize.INTEGER
      },
      voted: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PostAlls');
  }
};