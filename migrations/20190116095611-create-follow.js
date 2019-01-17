'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('follows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPerson: {
        type: Sequelize.INTEGER,
          references:{
              model: "Users",
              key: "id"
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
      },
      idFollows: {
        type: Sequelize.INTEGER,
          references:{
              model: "Users",
              key: "id"
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
    return queryInterface.dropTable('follows');
  }
};
