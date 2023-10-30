'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AfastamentoTemporarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuarioId: {
        type: Sequelize.INTEGER
      },
      usuarioNome: {
        type: Sequelize.STRING
      },
      dataSaida: {
        type: Sequelize.DATEONLY
      },
      dataRetorno: {
        type: Sequelize.DATEONLY
      },
      tipoViagem: {
        type: Sequelize.STRING
      },
      localViagem: {
        type: Sequelize.STRING
      },
      justificativa: {
        type: Sequelize.TEXT
      },
      planoReposicao: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('AfastamentoTemporarios');
  }
};