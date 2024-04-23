'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CandidatePublications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  CandidatePublications.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    idCandidate: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    titulo: {
      allowNull: false,
      type: DataTypes.STRING
    },
    ano: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    local: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tipo: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    natureza: {
      allowNull: false,
      type: DataTypes.STRING
    },
    autores: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    ISSN: {
      type: DataTypes.STRING(300),
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'CandidatePublications'
  })
  return CandidatePublications
}
