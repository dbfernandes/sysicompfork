"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LinhasDePesquisa extends Model {}

  LinhasDePesquisa.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
