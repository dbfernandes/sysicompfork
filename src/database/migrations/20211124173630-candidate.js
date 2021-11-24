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
      passwordHash: {
        allowNull:false,
        type: Sequelize.STRING
      },
      begin:{
        allowNull: true,
        type: Sequelize.DATETIME
      },
      finish:{
        allowNull: true,
        type: Sequelize.DATETIME
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
        type: Sequelize.STRING
      },
      motivos: {
        type: Sequelize.STRING
      },
      proposta: {
        type: Sequelize.STRING
      },
      curriculum: {
        type: Sequelize.STRING
      },
      prova_anterior: {
        type: Sequelize.STRING
      },
      diploma: {
        type: Sequelize.STRING
      },
      cotas: {
        allowNull:false,
      },
      status: {
        allowNull:false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Candidate');
  }
};
