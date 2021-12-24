import Edital from "../models/Edital";


class EditalService {


    async create({
        number,
        url,
        data_inicio,
        data_fim,
        carta_recomendacao,
        carta_orientador,
        mestrado,
        vaga_regular_mestrado,
        vaga_suplementar_mestrado,
        Doutorado,
        vaga_regular_doutorado,
        vaga_suplementar_doutorado
    }) {
        // criar novos editais

        let edital = await Edital.findOne({
            where: {
                editalId: number
            }
        }).catch(err => {
            console.log(err);
            throw new Error("Não foi possivel criar o edital");
        });
        if (edital) {
            throw new Error("Edital já existe");
        }

        edital = await Edital.create({
            editalId: nome,
            vaga_Doutorado : Doutorado,
            vaga_Mestrado: mestrado,
            cotas_Doutorado: vaga_regular_doutorado,
            cotas_Mestrado: vaga_regular_mestrado,
            carta_Orietador  : carta_orientador,
            carta_Rencomedacao : carta_recomendacao,
            documento: url,
            data_Inicio:  data_inicio,
            data_Fim: data_fim,
            curso: DataTypes.STRING,
        }).catch(err => {
            console.log(`[ERROR] Criar de Edital: ${err}`)
            throw new Error("Não foi possivel criar o Edital");
        })

        return edital;
    }

    async list() { // listagem dos editais

        const editais = [{
                numero: '021-2021',
                dataInicio: '01/01/2020',
                dataFim: '01/01/2021',
                cursos: 'Mestrado e Doutorado',
                vagasMestradoRegular: '10',
                vagasMestradoSuplementares: '10',
                vagasDoutoradoRegular: '10',
                vagasDoutoradoSuplementares: '10',
                url: 'http://www.propesp.ufam.edu.br/teste'
            },
            {
                numero: '022-2021',
                dataInicio: '01/01/2020',
                dataFim: '01/01/2021',
                cursos: 'Mestrado e Doutorado',
                vagasMestradoRegular: '10',
                vagasMestradoSuplementares: '10',
                vagasDoutoradoRegular: '10',
                vagasDoutoradoSuplementares: '10',
                url: 'http://www.propesp.ufam.edu.br/teste'
            }
        ]

        return editais;
    }

}

export default new EditalService;