'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('LinhasDePesquisa', [
      {
        id: 1,
        nome: 'Banco de Dados e Recuperacao de Informacao',
        sigla: 'BD e RI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nome: 'Sistemas Embarcados e Engenharia de Software',
        sigla: 'SE&ES',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nome: 'Inteligencia Artificial',
        sigla: 'IA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nome: 'Visao Computacional e Robotica',
        sigla: 'Visao',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        nome: 'Redes e Telecomunicacoes',
        sigla: 'Redes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        nome: 'Otimizacao, Alg. e Complexidade Computacional',
        sigla: 'Otim.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        nome: 'Software, Interacao e Aplicacoes',
        sigla: 'SIA',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('LinhasDePesquisa', null, {})
  }
}
