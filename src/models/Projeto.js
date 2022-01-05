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
    nome_projeto: DataTypes.STRING,
    convenio_projeto: DataTypes.STRING,
    conta_bancaria_projeto: DataTypes.STRING,
    inicio_projeto: DataTypes.DATE,
    fim_projeto: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Projeto',
  });
  return Projeto;
};
