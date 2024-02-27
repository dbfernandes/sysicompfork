'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projeto extends Model {
    
    static associate(models) {
      Projeto.belongsTo(models.Usuario, {
        foreignKey: 'idProfessor', as: "Usuario"
      });
    }
  };
  Projeto.init({
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
    descricao: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
      },
    },
    inicio: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
      },
    },
    fim: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: null,
    },
    papel: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
      },
    },
    financiadores: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
      },
    },
    integrantes: {
      type: DataTypes.STRING(1024),
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
  }, {
    sequelize,
    tableName: 'Projeto',
    modelName: 'Projeto',
  });
  return Projeto;
};
