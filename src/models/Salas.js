'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Salas.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: true, // Número não é obrigatório
    },
    andar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bloco: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Salas',
  });
  return Salas;
};