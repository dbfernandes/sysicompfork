'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Publicacao', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
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
        allowNull: false
      },
      ano: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      },
      local:{
        type: Sequelize.STRING(1024),
        allowNull: true,
        default: null
      },
      tipo:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'TipoPublicacao', key: 'id' },
        allowNull: false,
      },
      natureza: {
        type: Sequelize.STRING(100),
        allowNull: true,
        default: null
      },
      autores: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      ISSN: {
        type: Sequelize.STRING(300),
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
    await queryInterface.dropTable('Publicacao');
  }
};
