'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('reactions', {
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
      idPost: {
        type: Sequelize.INTEGER,
          references:{
              model: "posts",
              key: "id"
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
      },
      reaction: {
        type: Sequelize.INTEGER
      },
      private: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('reactions');
  }
};
