'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResearchLines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ResearchLines.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    icone: DataTypes.STRING,
    initials: DataTypes.STRING,
    color: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ResearchLines',
  });
  return ResearchLines;
};