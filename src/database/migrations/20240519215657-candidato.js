'use strict'
const { DataTypes } = require('sequelize')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Candidato', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20)
      },
      posicaoEdital: {
        allowNull: true,
        type: DataTypes.SMALLINT(6)
      },
      senhaHash: {
        allowNull: false,
        type: DataTypes.STRING
      },
      idEdital: {
        allowNull: false,
        type: DataTypes.STRING(20),
        references: {
          model: 'Edital',
          key: 'editalId'
        }
      },

      idLinhaPesquisa: {
        allowNull: true,
        type: DataTypes.INTEGER(20),
        references: {
          model: 'LinhasDePesquisa',
          key: 'id'
        }
      },
      nome: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(50)
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      sexo: {
        type: DataTypes.STRING(1),
        allowNull: true
      },
      nomeSocial: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      cep: {
        type: DataTypes.STRING(9),
        allowNull: true
      },
      uf: {
        type: DataTypes.STRING(2),
        allowNull: true
      },
      endereco: {
        type: DataTypes.STRING(160),
        allowNull: true
      },
      cidade: {
        type: DataTypes.STRING(40),
        allowNull: true
      },
      bairro: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      nacionalidade: {
        type: DataTypes.STRING(11),
        allowNull: true
      },
      telefone: {
        type: DataTypes.STRING(18),
        allowNull: true
      },
      telefoneSecundario: {
        type: DataTypes.STRING(18),
        allowNull: true
      },
      comoSoube: {
        type: DataTypes.STRING(100),
        allowNull: true 
      },
      cursoDesejado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      regime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cotista: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      cotistaTipo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      condicao: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      condicaoTipo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      bolsista: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      cursoGraduacao: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      instituicaoGraduacao: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      anoEgressoGraduacao: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cursoPos: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      tipoPos: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      instituicaoPos: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      anoEgressoPos: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tituloProposta: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      motivos: {
        type: DataTypes.STRING(1001),
        allowNull: true
      },
      nomeOrientador: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      Curriculum: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      CartaDoOrientador: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      PropostaDeTrabalho: {
        type: Sequelize.BLOB,
        allowNull: true
      }

    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
