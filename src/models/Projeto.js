'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projeto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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