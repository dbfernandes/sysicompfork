'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Candidate.belongsTo(models.LinhasDePesquisa, { foreignKey: 'linhaDePesquisaId', as: 'linhaDePesquisa'});
    }
  };
  Candidate.init({
    id: {
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    editalPosition:{
      type:DataTypes.INTEGER,
      allowNull:true,
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linhaDePesquisaId:{
      type:DataTypes.INTEGER,
      allowNull:true,
    },
    Nascimento:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Sexo:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    NomeSocial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CEP:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    UF:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Endereco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Cidade:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Bairro:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Nacionalidade:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Telefone:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    TelefoneSecundario:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    ComoSoube:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Curso:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Regime:{
      type: DataTypes.STRING,
      allowNull: true,
    },  
    Cotista:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    CotistaTipo:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Condicao:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    CondicaoTipo:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    Bolsista:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    editalId: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type:DataTypes.VIRTUAL,
      allowNull: false,
    },
    passwordHash: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    CursoGraduacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    InstituicaoGraduacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AnoEgressoGraduacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CursoPos: {
      type: DataTypes.STRING,
      allowNull: true,
    },	
    CursoPosTipo:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    CursoInstituicaoPos:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    CursoAnoEgressoPos:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  }, {
    sequelize,
    modelName: 'Candidate',
    freezeTableName: true,
    timestamps: false,
  });

  Candidate.beforeSave(async (candidate, options) => {
    if (candidate.password) {
      candidate.passwordHash = await bcrypt.hash(candidate.password, saltRounds);
    }
  });

  Candidate.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };
  
  return Candidate;
};