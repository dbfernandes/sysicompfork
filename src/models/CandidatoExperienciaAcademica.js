'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CandidatoExperienciaAcademica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      CandidatoExperienciaAcademica.belongsTo(models.Candidato, { foreignKey: 'idCandidato', as: 'candidato' })
    }
  };
  CandidatoExperienciaAcademica.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    idCandidato: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    instituicao: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    atividade: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    periodo: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CandidatoExperienciaAcademica',
    tableName: 'CandidatoExperienciaAcademica', // Adicione esta linha para especificar o nome da tabela
    timestamps: false // Se você não estiver usando campos createdAt e updatedAt
  })
  return CandidatoExperienciaAcademica
}
