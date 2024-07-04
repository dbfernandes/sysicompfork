'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReservaSalas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      SalaId: {
        type: Sequelize.INTEGER,
      },
      UsuarioId: {
        type: Sequelize.INTEGER,
      },
      atividade: {
        type: Sequelize.STRING,
      },
      tipo: {
        type: Sequelize.STRING,
      },
      dias: {
        type: Sequelize.STRING,
      },
      dataInicio: {
        type: Sequelize.DATEONLY,
      },
      dataTermino: {
        type: Sequelize.DATEONLY,
      },
      horaInicio: {
        type: Sequelize.TIME,
      },
      horaTermino: {
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReservaSalas');
  },
};
