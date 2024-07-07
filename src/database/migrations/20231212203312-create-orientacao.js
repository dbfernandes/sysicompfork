'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orientacao', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idProfessor: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict',
      },
      titulo: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      aluno: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      ano: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      natureza: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      tipo: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
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
    await queryInterface.dropTable('Orientacao');
  },
};
