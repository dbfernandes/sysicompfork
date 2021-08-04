'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Projeto', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_projeto: {
        type: Sequelize.STRING
      },
      convenio_projeto: {
        type: Sequelize.STRING
      },
      conta_bancaria_projeto: {
        type: Sequelize.STRING
      },
      inicio_projeto: {
        type: Sequelize.DATE
      },
      fim_projeto: {
        type: Sequelize.DATE
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Projeto');
  }
};