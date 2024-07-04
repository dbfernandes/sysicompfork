'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trancamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idAluno: {
        type: Sequelize.INTEGER,
      },
      tipo: {
        type: Sequelize.TINYINT,
      },
      dataSolicitacao: {
        type: Sequelize.DATE,
      },
      dataInicio: {
        type: Sequelize.DATE,
      },
      prevTermino: {
        type: Sequelize.DATE,
      },
      dataTermino: {
        type: Sequelize.DATE,
      },
      justificativa: {
        type: Sequelize.STRING,
      },
      documento: {
        type: Sequelize.TEXT,
      },
      doc_anexo: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.TINYINT,
      },
      id_responsavel: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Trancamentos');
  },
};
