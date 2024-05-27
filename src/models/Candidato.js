'use strict'
const {
  Model
} = require('sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = (sequelize, DataTypes) => {
  class Candidato extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Candidato.belongsTo(models.LinhasDePesquisa, { foreignKey: 'idLinhaPesquisa', as: 'linhaDePesquisa' })

    }
  };

  Candidato.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20)
      },
      posicaoEdital: {
        allowNull: true,
        type: DataTypes.SMALLINT(6)
      },
      senhaHash: {
        allowNull: false,
        type: DataTypes.STRING
      },
      idEdital: {
        allowNull: false,
        type: DataTypes.STRING(20),
        references: {
          model: 'Edital',
          key: 'editalId'
        }
      },
      idLinhaPesquisa: {
        allowNull: true,
        type: DataTypes.INTEGER(20),
        references: {
          model: 'LinhasDePesquisa',
          key: 'id'
        }
      },
      nome: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(50)
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      sexo: {
        type: DataTypes.STRING(1),
        allowNull: true
      },
      nomeSocial: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      cep: {
        type: DataTypes.STRING(9),
        allowNull: true
      },
      uf: {
        type: DataTypes.STRING(2),
        allowNull: true
      },
      endereco: {
        type: DataTypes.STRING(160),
        allowNull: true
      },
      cidade: {
        type: DataTypes.STRING(40),
        allowNull: true
      },
      bairro: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      nacionalidade: {
        type: DataTypes.STRING(11),
        allowNull: true
      },
      telefone: {
        type: DataTypes.STRING(18),
        allowNull: true
      },
      telefoneSecundario: {
        type: DataTypes.STRING(18),
        allowNull: true
      },
      comoSoube: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      cursoDesejado: {
        type: DataTypes.STRING,
        allowNull: true
      },
      regime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cotista: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      cotistaTipo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      condicao: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      condicaoTipo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bolsista: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      cursoGraduacao: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      instituicaoGraduacao: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      anoEgressoGraduacao: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cursoPos: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      tipoPos: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      instituicaoPos: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      anoEgressoPos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tituloProposta: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      motivos: {
        type: DataTypes.STRING(1001),
        allowNull: true
      },
      nomeOrientador: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      Curriculum: {
        type: DataTypes.BLOB,
        allowNull: true
      },
      CartaDoOrientador: {
        type: DataTypes.BLOB,
        allowNull: true
      },
      PropostaDeTrabalho: {
        type: DataTypes.BLOB,
        allowNull: true
      }
  }, {
    sequelize,
    modelName: 'Candidato',
    freezeTableName: true,
    timestamps: false
  })

  Candidato.beforeSave(async (candidate, options) => {
    if (candidate.password) {
      candidate.senhaHash = await bcrypt.hash(candidate.password, saltRounds)
    }
  })

  Candidato.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.senhaHash)
  }

  return Candidato
}
