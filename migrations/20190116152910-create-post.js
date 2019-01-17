'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      message: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.TEXT
      },
      yes: {
        type: Sequelize.INTEGER
      },
      no: {
        type: Sequelize.INTEGER
      },
        percent: {
            type: Sequelize.INTEGER
        },
      idUser: {
        type: Sequelize.INTEGER,
          references:{
              model: "Users",
              key: "id"
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
    return queryInterface.dropTable('posts');
  }
};
