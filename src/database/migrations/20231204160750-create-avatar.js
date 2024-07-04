'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Avatar', {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      idUsuario: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict',
      },
      nome: { type: Sequelize.STRING, allowNull: false },
      caminho: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Avatar');
  },
};
