'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('ReservaSalas',{
      type: 'foreign key',
      fields: ['UsuarioId'],
      name: 'reserva_usuario_fk',
      references: {
      table: 'Usuario',
      field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ReservaSalas', 'reserva_usuario_fk');
  }
};