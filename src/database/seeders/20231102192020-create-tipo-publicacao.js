'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoPublicacao', [

      {
        nome: "Artigos Publicados em Conferências",
        chave: "TRABALHO-EM-EVENTOS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: "Artigos Publicados em Periódicos",
        chave: "ARTIGO-PUBLICADO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: "Livros Publicados",
        chave: "LIVRO-PUBLICADO-OU-ORGANIZADO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: "Capítulos de Livros Publicados",
        chave: "CAPITULO-DE-LIVRO-PUBLICADO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoPublicacao', null, {});
  }
};
