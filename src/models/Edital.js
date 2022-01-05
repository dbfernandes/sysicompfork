'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Edital extends Model {
        static associate(models) {

        }
    };

    Edital.init({
        editalId: DataTypes.STRING,
        vagaDoutorado: DataTypes.INTEGER,
        vagaMestrado: DataTypes.INTEGER,
        cotasDoutorado: DataTypes.INTEGER,
        cotasMestrado: DataTypes.INTEGER,
        cartaOrientador: DataTypes.STRING,
        cartaRecomendacao: DataTypes.STRING,
        documento: DataTypes.STRING,
        dataInicio: DataTypes.STRING,
        dataFim: DataTypes.STRING,
        curso: DataTypes.STRING,
        status: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Edital',
        freezeTableName: true,
        timestamps: false,
    });
    
    return Edital;
};