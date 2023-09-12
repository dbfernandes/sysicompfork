'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReservaSalas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idSala: {
        type: Sequelize.INTEGER
      },
      idSolicitante: {
        type: Sequelize.INTEGER
      },
      atividade: {
        type: Sequelize.STRING
      },
      dataInicio: {
        type: Sequelize.DATE
      },
      dataTermino: {
        type: Sequelize.DATE
      },
      horaInicio: {
        type: Sequelize.TIME
      },
      horaTermino: {
        type: Sequelize.TIME
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
    await queryInterface.dropTable('ReservaSalas');
  }
};