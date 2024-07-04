'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aluno extends Model {
    static associate(models) {}
  }
  Aluno.init(
    {
      nomeCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      curso: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      periodoIngresso: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
      },
      periodoConclusao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      formado: {
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
      modelName: 'Aluno',
      tableName: 'Aluno',
    },
  );
  return Aluno;
};
