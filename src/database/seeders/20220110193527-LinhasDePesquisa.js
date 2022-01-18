'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('LinhasDePesquisa', [
      {
        id: 1,
        nome: 'Banco de Dados e Recuperacao de Informacao',
        sigla: 'BD e RI',
        cor: 'rgb(1,68,248)',
        icone: 'fa fa-solid fa-database',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nome: 'Sistemas Embarcados e Engenharia de Software',
        sigla: 'SE&ES',
        cor: 'rgb(211,236,40)',
        icone: 'fab fa-trello',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nome: 'Inteligencia Artificial',
        sigla: 'IA',
        cor: 'rgb(254,216,244)',
        icone: 'fa fa-solid fa-object-group',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        nome: 'Visao Computacional e Robotica',
        sigla: 'Visao',
        cor: 'rgb(202,56,176)',
        icone: 'fa fa-solid fa-eye',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        nome: 'Redes e Telecomunicacoes',
        sigla: 'Redes',
        cor: 'rgb(69,94,35)',
        icone: 'fa fa-solid fa-globe-americas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        nome: 'Otimizacao, Alg. e Complexidade Computacional',
        sigla: 'Otim.',
        cor: 'rgb(48,173,165)',
        icone: 'fas fa-share-alt',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        nome: 'Software, Interacao e Aplicacoes',
        sigla: 'SIA',
        cor: 'rgb(56,205,28)',
        icone: 'fa fa-solid fa-window-restore',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('LinhasDePesquisa', null, {});
  }
};
