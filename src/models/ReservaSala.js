'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservaSala extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Salas, { as: 'salas', foreignKey: 'SalaId' });
      this.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'UsuarioId' });
    }
  };
  ReservaSala.init({
    SalaId:{ 
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    UsuarioId:{ 
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    atividade:{ 
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo:{
      type: DataTypes.STRING,
      allowNull: false
    },
    dias:{
      type: DataTypes.STRING,
      allowNull: true
    },
    semanal: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    dataInicio: { 
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dataTermino:{ 
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    horaInicio:{ 
      type: DataTypes.TIME,
      allowNull: false
    },
    horaTermino: { 
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ReservaSala',
  });
  return ReservaSala;
};