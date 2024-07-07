'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orientacao extends Model {
    static associate(models) {
      Orientacao.belongsTo(models.Usuario, {
        foreignKey: 'idProfessor',
        as: 'Usuario',
      });
    }
  }
  Orientacao.init(
    {
      idProfessor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      titulo: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      aluno: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      ano: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      natureza: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      tipo: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      status: {
        type: DataTypes.SMALLINT,
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
      tableName: 'Orientacao',
      modelName: 'Orientacao',
    },
  );
  return Orientacao;
};
