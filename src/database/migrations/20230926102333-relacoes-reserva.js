'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('ReservaSalas', {
      type: 'foreign key',
      fields: ['SalaId'],
      name: 'reserva_sala_fk',
      references: {
      table: 'Salas',
      field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'restrict'
    },{
      type: 'foreign key',
      fields: ['UsuarioId'],
      name: 'reserva_usuario_fk',
      references: {
      table: 'Usuario',
      field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'restrict'
    }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ReservaSalas', 'foreign key');
  }
};