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
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "username"
    },
    shortname: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    auth_key: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "password_reset_token"
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
    visualizacao_candidatos: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    visualizacao_candidatos_finalizados: {
      type: DataTypes.DATE,
      allowNull: false
    },
    visualizacao_cartas_respondidas: {
      type: DataTypes.DATE,
      allowNull: false
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
    suporte: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    aluno: {
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
    titulacao: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    classe: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nivel: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    regime: {
      type: DataTypes.STRING(10),
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
    formacao: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    resumo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    alias: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ultimaAtualizacao: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    idRH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cargo: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
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
        name: "username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
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
        name: "password_reset_token",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "password_reset_token" },
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
 


