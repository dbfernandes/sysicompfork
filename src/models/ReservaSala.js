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
      this.belongsTo(models.Salas, { as: 'usuario', foreignKey: 'UsuarioId' });
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
    dataInicio: { 
      type: DataTypes.DATE,
      allowNull: false
    },
    dataTermino:{ 
      type: DataTypes.DATE,
      allowNull: false
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