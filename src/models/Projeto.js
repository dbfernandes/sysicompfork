'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projeto extends Model {
    
    static associate(models) {

    }
  };
  Projeto.init({
    nome_projeto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    convenio_projeto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conta_bancaria_projeto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inicio_projeto: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fim_projeto: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Projeto',
  });
  return Projeto;
};
