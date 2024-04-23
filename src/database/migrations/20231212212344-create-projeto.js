'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Projeto', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idProfessor: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      titulo: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING(5000),
        allowNull: false
      },
      inicio: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      },
      fim: {
        type: Sequelize.INTEGER(4),
        allowNull: true
      },
      papel: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      financiadores: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      integrantes: {
        type: Sequelize.STRING(1024),
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Projeto')
  }
}
