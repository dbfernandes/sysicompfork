'use strict';
const {
  Model
} = require('sequelize');

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
    }
  };
  Candidate.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      editalPosition:{
        allowNull:true,
        type:DataTypes.INTEGER
      },
      editalId:{
        allowNull:false,
        type: DataTypes.STRING
      },
      passwordHash: {
        allowNull:false,
        type: DataTypes.STRING
      },
      begin:{
        allowNull: true,
        type: DataTypes.DATE
      },
      finish:{
        allowNull: true,
        type: DataTypes.DATE
      },
      currentStep:{
        allowNull:false,
        type:DataTypes.INTEGER,
        defaultValue: 0
      },
      name:{
        allowNull: true,
        type: DataTypes.STRING
      },
      socialName:{
        allowNull: true,
        type: DataTypes.STRING
      },
      address:{
        allowNull: true,
        type: DataTypes.STRING
      },
      neighborhood:{
        allowNull: true,
        type: DataTypes.STRING
      },
      city:{
        allowNull: true,
        type: DataTypes.STRING
      },
      uf:{
        allowNull: true,
        type: DataTypes.STRING
      },
      cep:{
        allowNull: true,
        type: DataTypes.STRING
      },
      email:{
        allowNull: true,
        type: DataTypes.STRING
      },
      birthday:{
        type: DataTypes.DATE
      },
      nationality:{
        type:DataTypes.INTEGER
      },
      country: {
        type: DataTypes.STRING
      },
      passport: {
        type: DataTypes.STRING
      },
      cpf: {
        type: DataTypes.STRING
      },
      gender:{
        type: DataTypes.STRING
      },
      homePhone:{
        type: DataTypes.STRING
      },
      cellPhone: {
        type: DataTypes.STRING
      },
      desiredCourse: {
        type: DataTypes.STRING
      },
      polity: {
        type: DataTypes.STRING
      },
      inscricaoposcomp: {
        type: DataTypes.STRING
      },
      anoposcomp: {
        type: DataTypes.STRING
      },
      nivel: {
        type: DataTypes.STRING
      },
      notaposcomp: {
        type: DataTypes.STRING
      },
      solicitabolsa: {
        type: DataTypes.STRING
      },
      tituloproposta: {
        type: DataTypes.STRING
      },
      cartaorientador: {
        type: DataTypes.BLOB
      },
      motivos: {
        type: DataTypes.TEXT
      },
      proposta: {
        type: DataTypes.BLOB
      },
      curriculum: {
        type: DataTypes.BLOB
      },
      prova_anterior: {
        type: DataTypes.BLOB
      },
      diploma: {
        type: DataTypes.BLOB
      },
      cotas: {
        allowNull:true,
        type: DataTypes.STRING
      },
      status: {
        allowNull:false,
        type: DataTypes.STRING,
        defaultValue: '0'
      }

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