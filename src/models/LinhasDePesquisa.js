"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LinhasDePesquisa extends Model {
    static associate(models) {
      // fazer as associações aqui
      LinhasDePesquisa.belongsToMany(models.Candidate, {
        through: "CandidateLinhasDePesquisa",
        foreignKey: "candidateId",
        otherKey: "linhaDePesquisaId",
        onDelete: "RESTRICT",
      });
    }
  }

  LinhasDePesquisa.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sigla: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "LinhasDePesquisa",
    }
  );

  return LinhasDePesquisa;
};
