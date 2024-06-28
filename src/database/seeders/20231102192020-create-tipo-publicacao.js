'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoPublicacao', [
      {
        nome: 'Artigo Publicado em Conferências',
        chave: 'TRABALHO-EM-EVENTOS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Artigo Publicado em Periódicos',
        chave: 'ARTIGO-PUBLICADO',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Livro Publicado',
        chave: 'LIVRO-PUBLICADO-OU-ORGANIZADO',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Capítulo de Livro Publicado',
        chave: 'CAPITULO-DE-LIVRO-PUBLICADO',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoPublicacao', null, {});
  },
};
