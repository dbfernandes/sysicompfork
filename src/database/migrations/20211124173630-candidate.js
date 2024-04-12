'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Candidate', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      editalPosition:{
        allowNull:true,
        type:Sequelize.INTEGER
      },
      editalId:{
        allowNull:false,
        type: Sequelize.STRING
      },
      linhaDePesquisaId:{
        allowNull:true,
        type: Sequelize.INTEGER,
      },
      passwordHash: {
        allowNull:false,
        type: Sequelize.STRING
      },
      Nome: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email:{
        allowNull: true,
        type: Sequelize.STRING
      },
      Nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      Sexo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      NomeSocial: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CEP: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      UF: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Endereco: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Cidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Bairro: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Nacionalidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Telefone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      TelefoneSecundario: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ComoSoube: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Curso: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Regime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Cotista: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      CotistaTipo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Condicao: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      CondicaoTipo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Bolsista: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      CursoGraduacao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      InstituicaoGraduacao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      AnoEgressoGraduacao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CursoPos: {
        type: Sequelize.STRING,
        allowNull: true,
      },	
      CursoPosTipo:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      CursoInstituicaoPos:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      CursoAnoEgressoPos:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      Curriculum:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      CartaDoOrientador:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      PropostaDeTrabalho:{
        type: Sequelize.BLOB,
        allowNull: true,
      },

      

    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Candidate');
  }
};
