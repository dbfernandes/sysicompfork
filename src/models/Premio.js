'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Premio extends Model {
    static associate (models) {
      Premio.belongsTo(models.Usuario, {
        foreignKey: 'idProfessor', as: 'Professor'
      })
    }
  }
  Premio.init(
    {
      idProfessor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' }
        }
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' }
        }
      },
      entidade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' }
        }
      },
      ano: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' }
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Premio',
      tableName: 'Premios'
    }

  )
  return Premio
}
