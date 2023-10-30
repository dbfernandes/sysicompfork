'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AfastamentoTemporario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AfastamentoTemporario.init({
    usuarioId: {
      type: DataTypes.INTEGER
    },
    usuarioNome: {
      type: DataTypes.STRING
    },
    dataSaida: {
      type: DataTypes.DATEONLY
    },
    dataRetorno: {
      type: DataTypes.DATEONLY
    },
    tipoViagem: {
      type: DataTypes.STRING
    },
    localViagem: {
      type: DataTypes.STRING
    },
    justificativa: {
      type: DataTypes.TEXT
    },
    planoReposicao: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'AfastamentoTemporario',
  });
  return AfastamentoTemporario;
};
