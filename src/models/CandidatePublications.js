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
    idCandidate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    titulo: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    ano: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    local: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureza: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    autores: {
      type:DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'CandidatePublications',
  });
  return CandidatePublications;
};