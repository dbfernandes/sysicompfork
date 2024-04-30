'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Premios', {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      idProfessor: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      titulo: { type: Sequelize.STRING, allowNull: false },
      entidade: { type: Sequelize.STRING, allowNull: false },
      ano: { type: Sequelize.INTEGER(4), allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Premios')
  }
}
