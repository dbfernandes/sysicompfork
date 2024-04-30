'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prorrogacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idAluno: {
        type: Sequelize.INTEGER
      },
      dataSolicitacao: {
        type: Sequelize.DATE
      },
      dataInicio: {
        type: Sequelize.DATE
      },
      qtdDias: {
        type: Sequelize.INTEGER
      },
      documento: {
        type: Sequelize.TEXT
      },
      justificativa: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      data_termino: {
        type: Sequelize.DATE
      },
      id_responsavel: {
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prorrogacoes')
  }
}
