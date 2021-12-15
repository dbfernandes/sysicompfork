'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Recommendations', {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Recommendations');
  }
};
