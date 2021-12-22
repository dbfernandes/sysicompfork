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
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    editalId: DataTypes.STRING,
    password: DataTypes.VIRTUAL,
    passwordHash: DataTypes.STRING,
    currentStep: DataTypes.INTEGER,
    status: DataTypes.STRING,

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

  Candidate.prototype.validPassword = function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return Candidate;
};