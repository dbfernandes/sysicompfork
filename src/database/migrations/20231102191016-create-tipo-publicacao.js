'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TipoPublicacao', {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      nome: { type: Sequelize.STRING, allowNull: false },
      chave: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TipoPublicacao');
  }
};
