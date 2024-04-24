'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Candidate', {
      fields: ['linhaDePesquisaId'],
      type: 'foreign key',
      name: 'fk_Candidate_LinhaDePesquisa',
      references: {
        table: 'LinhasDePesquisa',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Candidate', 'relacao_Candidate_LinhaDePesquisa')
  }
}
