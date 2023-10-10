  'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Edital', {
  
      editalId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
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
      status:{
        allowNull : false,
        type : Sequelize.STRING,
        defaultValue:0,
      },
      createdAt: {
        type : Sequelize.STRING,
        allowNull: false,
      },
      updatedAt: {
        type : Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('Edital');
    
  }
};
