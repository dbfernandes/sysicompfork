'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ReservaSalas', [
      {
        id: 1,
        SalaId: '1',
        UsuarioId: '2',
        atividade: 'Seminários',
        tipo: "Aula",
        semanal: true,
        dias: "Terça, Quinta",
        horaInicio: '10:00',
        horaTermino: '12:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('ReservaSalas', null, {});
    
  }
};
