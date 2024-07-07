'use strict';
const { Model } = require('sequelize');
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
  }
  AfastamentoTemporario.init(
    {
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuarioNome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataSaida: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dataRetorno: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tipoViagem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      localViagem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      justificativa: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      planoReposicao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AfastamentoTemporario',
    },
  );
  return AfastamentoTemporario;
};
