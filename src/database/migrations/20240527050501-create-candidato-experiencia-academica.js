'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CandidatoExperienciaAcademica', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      idCandidato: {
        allowNull: false,
        type: DataTypes.BIGINT(20),
        references: {
          model: 'Candidato',
          key: 'id'
        },
      },
      instituicao: {
        allowNull: false,
        type: DataTypes.STRING(60)
      },
      atividade: {
        type: DataTypes.STRING(60)
      },
      periodo: {
        type: DataTypes.STRING(30)
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
