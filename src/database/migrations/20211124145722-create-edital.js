'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Edital', {
      editalId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
      },
      vagaDoutorado: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cotasDoutorado: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      vagaMestrado: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cotasMestrado: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cartaOrientador: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cartaRecomendacao: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      documento: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dataInicio: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      dataFim: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '0',
      },
      inscricoesIniciadas: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      inscricoesEncerradas: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Edital');
  },
};
