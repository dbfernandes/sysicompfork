const Sequelize = require('sequelize')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publicacao extends Model {
    
    static associate(models) {
        this.belongsToMany(models.Usuario, { 
          through: 'RelUsuarioPublicacao', 
          foreignKey: 'idPublicacao',
          as: "Professor"
        })
        this.belongsTo(models.TipoPublicacao, { 
          foreignKey: 'tipo', as: "Tipo" 
        })
    }
  }

  Publicacao.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
        notEmpty: { msg: 'Este campo não pode ser vazio' },
      },
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
      },
    },
    local: {
        type: DataTypes.STRING(1024),
        defaultValue: null,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.SMALLINT(1),
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
        },
    },
    natureza: {
      type: DataTypes.STRING(100),
      defaultValue: null,
      allowNull: true,
    },
    autores: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
          notEmpty: { msg: 'Este campo não pode ser vazio' },
        },
    },
    ISSN: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: {
          notNull: { msg: 'Este campo não pode ser vazio' },
          notEmpty: { msg: 'Este campo não pode ser vazio' },
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
  },{
    sequelize,
    tableName: 'Publicacao',
    modelName: 'Publicacao',
    timestamps: false,
  });


  return Publicacao;
}
 


