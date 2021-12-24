'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Edital', {
      id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      editalId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      vagaDoutorado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      cotasDoutorado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      vagaMestrado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      cotasMestrado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      cartaOrientador:{
        allowNull : false,
        type: Sequelize.STRING
      },
      cartaRecomendacao:{
        allowNull : false,
        type : Sequelize.STRING
      },
      documento:{
      allowNull : false,
      type : Sequelize.STRING
      },
      dataInicio:{
        allowNull : false,
        type : Sequelize.STRING
      },
      dataFim:{
        allowNull : false,
        type : Sequelize.STRING
      },
      curso:{
        allowNull : false,
        type : Sequelize.STRING
      },
      status:{
        allowNull : false,
        type : Sequelize.STRING,
        defaultValue:0,
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
    
    await queryInterface.dropTable('Edital');
    
  }
};
