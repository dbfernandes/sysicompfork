'use strict';

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Selecao extends Model {

        static associate(models) {

        }
    };
    Selecao.init({
        numero_Primaria: DataTypes.STRING,
        vaga_Doutorado: DataTypes.INTEGER,
        vaga_Mestrado: DataTypes.INTEGER,
        cotas_Doutorado: DataTypes.INTEGER,
        cotas_Mestrado: DataTypes.INTEGER,
        carta_Orietador: DataTypes.STRING,
        carta_Rencomedacao: DataTypes.STRING,
        documento: DataTypes.STRING,
        data_Inicio: DataTypes.DATE,
        data_Fim: DataTypes.DATE,
        curso: DataTypes.STRING,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Selecao',
    });
    return Selecao;
};