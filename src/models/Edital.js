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
        editalId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        vagaDoutorado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vagaMestrado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cotasDoutorado: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        cotasMestrado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cartaOrientador: {
            type:DataTypes.STRING,
            allowNull: false
        },
        cartaRecomendacao: {
            type:DataTypes.STRING,
            allowNull: false
        },
        documento: {
            type:DataTypes.STRING,
            allowNull: false
        },
        dataInicio: {
            type:DataTypes.STRING,
            allowNull: false
        },
        dataFim: {
            type:DataTypes.STRING,
            allowNull: false
        },        
        status: {
            type:DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: false,
          },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'Edital',
        modelName: 'Edital',
        timestamps: false,
    });
    
    return Edital;
};