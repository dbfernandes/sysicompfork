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
        cartaOrietador: DataTypes.STRING,
        cartaRencomedacao: DataTypes.STRING,
        documento: DataTypes.STRING,
        dataInicio: DataTypes.DATE,
        dataFim: DataTypes.DATE,
        curso: DataTypes.STRING,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Edital',
    });
    
    return Edital;
};