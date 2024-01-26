'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Aluno', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomeCompleto: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      curso: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      periodoIngresso: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      periodoConclusao: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      formado: {
        type: Sequelize.SMALLINT,
        allowNull: false
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
    await queryInterface.dropTable('Aluno');
  }
};