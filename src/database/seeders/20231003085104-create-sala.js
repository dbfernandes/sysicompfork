'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Salas', [
      {
        id: 1,
        nome: 'Auditório',
        capacidade: 100,
        numero: 1,
        bloco: 'Icomp Tech',
        andar: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nome: 'Laboratório de Graduação',
        capacidade: 50,
        numero: 2,
        bloco: 'Icomp 1',
        andar: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nome: 'Sala 4',
        capacidade: 40,
        numero: 4,
        bloco: 'Icomp 2',
        andar: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Salas', null, {})
  }
}
