'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CandidateAcademicExperience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CandidateAcademicExperience.init({
    id: DataTypes.INTEGER,
    idCandidate: DataTypes.INTEGER,
    instituicao: DataTypes.STRING,
    atividade: DataTypes.STRING,
    periodo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CandidateAcademicExperience',
  });
  return CandidateAcademicExperience;
};