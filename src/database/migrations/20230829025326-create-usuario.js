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
      turno: {
        type: Sequelize.STRING(32),
        allowNull: true
      },
      idLattes: {
        type: Sequelize.BIGINT,
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
