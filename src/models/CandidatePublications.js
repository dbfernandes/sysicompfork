'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CandidatePublications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CandidatePublications.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
    },
    idCandidate: DataTypes.INTEGER,
    titulo: DataTypes.STRING,
    ano: DataTypes.INTEGER,
    local: DataTypes.STRING,
    tipo: DataTypes.STRING,
    natureza: DataTypes.STRING,
    autores: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CandidatePublications',
  });
  return CandidatePublications;
};