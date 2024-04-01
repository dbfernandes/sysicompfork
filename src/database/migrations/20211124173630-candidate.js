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
        type: Sequelize.INTEGER
      },
      passwordHash: {
        allowNull:false,
        type: Sequelize.STRING
      },
      begin:{
        allowNull: true,
        type: Sequelize.DATE
      },
      finish:{
        allowNull: true,
        type: Sequelize.DATE
      },
      currentStep:{
        allowNull:false,
        type:Sequelize.INTEGER,
        defaultValue: 0
      },
      name:{
        allowNull: true,
        type: Sequelize.STRING
      },
      socialName:{
        allowNull: true,
        type: Sequelize.STRING
      },
      address:{
        allowNull: true,
        type: Sequelize.STRING
      },
      neighborhood:{
        allowNull: true,
        type: Sequelize.STRING
      },
      city:{
        allowNull: true,
        type: Sequelize.STRING
      },
      uf:{
        allowNull: true,
        type: Sequelize.STRING
      },
      cep:{
        allowNull: true,
        type: Sequelize.STRING
      },
      email:{
        allowNull: true,
        type: Sequelize.STRING
      },
      birthday:{
        type: Sequelize.DATE
      },
      nationality:{
        type:Sequelize.INTEGER
      },
      country: {
        type: Sequelize.STRING
      },
      passport: {
        type: Sequelize.STRING
      },
      cpf: {
        type: Sequelize.STRING
      },
      gender:{
        type: Sequelize.STRING
      },
      homePhone:{
        type: Sequelize.STRING
      },
      cellPhone: {
        type: Sequelize.STRING
      },
      desiredCourse: {
        type: Sequelize.STRING
      },
      polity: {
        type: Sequelize.STRING
      },
      inscricaoposcomp: {
        type: Sequelize.STRING
      },
      nivel: {
        type: Sequelize.STRING
      },
      anoposcomp: {
        type: Sequelize.STRING
      },
      notaposcomp: {
        type: Sequelize.STRING
      },
      solicitabolsa: {
        type: Sequelize.STRING
      },
      tituloproposta: {
        type: Sequelize.STRING
      },
      cartaorientador: {
        type: Sequelize.BLOB
      },
      motivos: {
        type: Sequelize.TEXT
      },
      proposta: {
        type: Sequelize.BLOB
      },
      curriculum: {
        type: Sequelize.BLOB
      },
      prova_anterior: {
        type: Sequelize.BLOB
      },
      diploma: {
        type: Sequelize.BLOB
      },
      cotas: {
        allowNull:true,
        type: Sequelize.STRING
      },
      status: {
        allowNull:false,
        type: Sequelize.STRING,
        defaultValue: '0'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Candidate');
  }
};
