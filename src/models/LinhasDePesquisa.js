"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LinhasDePesquisa extends Model {}

  LinhasDePesquisa.init(
    {
      nome: DataTypes.STRING,
      sigla: DataTypes.STRING,
      icone: DataTypes.STRING,
      cor: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "LinhasDePesquisa",
    }
  );

  return LinhasDePesquisa;
};
