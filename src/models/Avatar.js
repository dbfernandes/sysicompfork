const { Model } = require('sequelize');
'use strict';
module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
    static associate(models) {
      Avatar.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario', as: "Usuario"
      });
    }
  }
  Avatar.init(
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Este campo não pode ser vazio' },
          },
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      caminho: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Avatar',
      tableName: 'Avatar',
    },
    
  );
  return Avatar;
};
