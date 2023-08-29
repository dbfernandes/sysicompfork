'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('Usuario', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: "username"
      },
      shortname: {
        type: Sequelize.STRING(40),
        allowNull: true
      },
      auth_key: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      password_reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: "password_reset_token"
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: "email"
      },
      status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 10
      },
      visualizacao_candidatos: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      visualizacao_candidatos_finalizados: {
        type: Sequelize.DATE,
        allowNull: false
      },
      visualizacao_cartas_respondidas: {
        type: Sequelize.DATE,
        allowNull: false
      },
      administrador: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      coordenador: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      secretaria: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      professor: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      suporte: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      aluno: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      siape: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      dataIngresso: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      endereco: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      telcelular: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      telresidencial: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      unidade: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      titulacao: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      classe: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      nivel: {
        type: Sequelize.STRING(6),
        allowNull: true
      },
      regime: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      turno: {
        type: Sequelize.STRING(32),
        allowNull: true
      },
      idLattes: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      formacao: {
        type: Sequelize.STRING(300),
        allowNull: true
      },
      resumo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      alias: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      ultimaAtualizacao: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      idRH: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cargo: {
        type: Sequelize.STRING(32),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Usuario');

  }
};
