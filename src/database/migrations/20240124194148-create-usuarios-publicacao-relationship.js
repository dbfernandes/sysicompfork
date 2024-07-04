'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RelUsuarioPublicacao', {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      idUsuario: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Usuario', key: 'id' },
      },
      idPublicacao: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Publicacao', key: 'id' },
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RelUsuarioPublicacao');
  },
};
