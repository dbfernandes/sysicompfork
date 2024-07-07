'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoPublicacao extends Model {
    static associate(models) {
      TipoPublicacao.hasMany(models.Publicacao, {
        foreignKey: 'tipo',
        as: 'Publicacoes',
      });
    }
  }
  TipoPublicacao.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chave: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TipoPublicacao',
      tableName: 'TipoPublicacao',
    },
  );
  return TipoPublicacao;
};
