'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('ReservaSalas', {
      type: 'foreign key',
      fields: ['SalaId'],
      name: 'reserva_sala_fk',
      references: {
        table: 'Salas',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ReservaSalas', 'reserva_sala_fk');
  },
};
