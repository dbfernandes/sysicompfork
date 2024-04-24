'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CandidatePublications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idCandidate: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ano: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      local: {
        allowNull: true,
        type: Sequelize.STRING
      },
      tipo: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      natureza: {
        allowNull: false,
        type: Sequelize.STRING
      },
      autores: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ISSN: {
        type: Sequelize.STRING(300),
        allowNull: true
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
    await queryInterface.dropTable('CandidatePublications')
  }
}
