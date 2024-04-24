'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CandidateAcademicExperience', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idCandidate: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      instituicao: {
        allowNull: false,
        type: Sequelize.STRING
      },
      atividade: {
        allowNull: false,
        type: Sequelize.STRING
      },
      periodo: {
        allowNull: false,
        type: Sequelize.STRING
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CandidateAcademicExperience')
  }
}
