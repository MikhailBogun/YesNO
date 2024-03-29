'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {


        return queryInterface.addColumn(
            'follows',
            'relationship',
            Sequelize.INTEGER
        );
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.removeColumn(
            'follows',
            'relationship'
        );
    }
};
