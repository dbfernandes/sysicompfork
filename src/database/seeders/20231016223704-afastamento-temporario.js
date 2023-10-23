'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('AfastamentoTemporarios', [
      {
        id: 1,
        usuarioNome: "Bob",
        dataSaida: new Date(2021,6,10),
        dataRetorno: new Date(2021,7,10),
        tipoViagem: 'Nacional',
        localViagem: 'São Paulo',
        justificativa: 'Viagem para São Paulo',
        planoReposicao: 'Fazer reposição',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        usuarioNome: "Jhon",
        dataSaida: new Date(2021,6,10),
        dataRetorno: new Date(2021,7,10),
        tipoViagem: 'Nacional',
        localViagem: 'Rio de Janeiro',
        justificativa: 'Viagem para Rio de Janeiro',
        planoReposicao: 'Fazer reposição',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AfastamentoTemporarios', null, {});
  }
};