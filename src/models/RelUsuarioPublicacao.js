'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RelUsuarioPublicacao extends Model {
    static associate (models) {

    }
  }
  RelUsuarioPublicacao.init(
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' }
        }
      },
      idPublicacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' }
        }
      }
    },
    {
      sequelize,
      modelName: 'RelUsuarioPublicacao',
      tableName: 'RelUsuarioPublicacao'
    }
  )
  return RelUsuarioPublicacao
}
