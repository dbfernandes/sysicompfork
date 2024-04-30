'use strict'
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
        allowNull: false,
        type: Sequelize.INTEGER
      },
      usuarioNome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dataSaida: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      dataRetorno: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      tipoViagem: {
        allowNull: false,
        type: Sequelize.STRING
      },
      localViagem: {
        allowNull: false,
        type: Sequelize.STRING
      },
      justificativa: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      planoReposicao: {
        allowNull: false,
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AfastamentoTemporarios')
  }
}
