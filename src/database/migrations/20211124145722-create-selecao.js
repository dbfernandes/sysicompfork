'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Selecao', {
      numero_Primaria: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      vaga_Doutorado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      cotas_Doutorado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      vaga_Mestrado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      cotas_Mestrado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      carta_Orientador:{
        allowNull : false,
        type: Sequelize.STRING
      },
      carta_Recomendacao:{
        allowNull : false,
        type : Sequelize.STRING
      },
      documento:{
      allowNull : false,
      type : Sequelize.STRING
      },
      curso:{
        allowNull : false,
        type : Sequelize.STRING
      },
      status:{
        allowNull : false,
        type : Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('Selecao');
    
  }
};
