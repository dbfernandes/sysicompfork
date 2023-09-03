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
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "cpf"
    },
    senhaHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tokenResetSenha: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "tokenResetSenha"
    },
    validadeTokenResetSenha: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 10
    },
    administrador: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    coordenador: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    secretaria: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    professor: {
      type: DataTypes.CHAR(1),
      allowNull: true
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
    telcelular: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    telresidencial: {
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
    if(this.administrador === '1') perfis += ' Administrador |'
    if(this.coordenador === '1') perfis += ' Coordenador |'
    if(this.professor === '1') perfis += ' Professor |'
    if(this.secretaria === '1') perfis += ' Secretaria'

    if(perfis.endsWith(' |'))
        perfis = perfis.substring(0, perfis.length-2)

    return perfis
  }

  return Usuario;
}
 


