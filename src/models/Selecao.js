import  {Model , DataTypes} from 'sequelize';
class Selecao extends Model {
    static init(sequelize) {
        super.init({
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
        },{
            sequelize,
            tableName: 'Selecao',
        })
    }
}

export default Selecao;


