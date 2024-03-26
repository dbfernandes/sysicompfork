'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('Usuario', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nomeCompleto: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      senhaHash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tokenResetSenha: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      validadeTokenResetSenha: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
      },
      administrador: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0
      },
      coordenador: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0
      },
      secretaria: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0
      },
      professor: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0
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
      telCelular: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      telResidencial: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      unidade: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      turno: {
        type: Sequelize.STRING(32),
        allowNull: true
      },
      idLattes: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      formacao: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      formacaoIngles: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      resumo: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      resumoIngles: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      ultimaAtualizacao: {
        type: Sequelize.DATE,
        allowNull: true,
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
