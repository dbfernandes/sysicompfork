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
    currentStep: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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