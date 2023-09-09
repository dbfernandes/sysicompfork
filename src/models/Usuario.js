const Sequelize = require('sequelize')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    
    static associate(models) {
      // define association here
    }
  }

  Usuario.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomeCompleto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
        notEmpty: { msg: 'Este campo não pode ser vazio' },
      },
    },
    cpf: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: { msg: 'Número de CPF já cadastrado' },
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
        notEmpty: { msg: 'Este campo não pode ser vazio' },
      },
    },
    senhaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
        notEmpty: { msg: 'Este campo não pode ser vazio' },
      },
    },
    tokenResetSenha: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    validadeTokenResetSenha: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: { msg: 'E-mail já cadastrado' },
      validate: {
        notNull: { msg: 'Este campo não pode ser vazio' },
        notEmpty: { msg: 'Este campo não pode ser vazio' },
      },
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    administrador: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    coordenador: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    secretaria: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    professor: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    siape: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    dataIngresso: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telCelular: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    telResidencial: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    unidade: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    turno: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    idLattes: {
      type: DataTypes.BIGINT,
      allowNull: true
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
    tableName: 'Usuario',
    modelName: 'Usuario',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "cpf",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cpf" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "tokenResetSenha",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tokenResetSenha" },
        ]
      },
    ]
  });

  Usuario.prototype.perfis = function () {
    let perfis = ''
    if(this.administrador === 1) perfis += ' Administrador |'
    if(this.coordenador === 1) perfis += ' Coordenador |'
    if(this.professor === 1) perfis += ' Professor |'
    if(this.secretaria === 1) perfis += ' Secretaria'

    if(perfis.endsWith(' |'))
        perfis = perfis.substring(0, perfis.length-2)

    return perfis
  }

  return Usuario;
}
 


