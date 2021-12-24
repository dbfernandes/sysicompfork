import Edital from "../models/Edital";


const curso = "Curso";
class EditalService {
    async create({
        number,
        url,
        data_inicio,
        data_fim,
        carta_recomendacao,
        carta_orientador,
        vaga_regular_mestrado,
        vaga_regular_doutorado,
        vaga_suplementar_mestrado,
        vaga_suplementar_doutorado
    }) {
        //TO-DO Verificar se o numero do edital já existe
        const edital = await Edital.create({
            number: number,
            url: url,
            data_inicio: data_inicio,
            data_fim: data_fim,
            carta_recomendacao: carta_recomendacao,
            carta_orientador: carta_orientador,
            vaga_regular_mestrado: vaga_regular_mestrado,
            vaga_regular_doutorado: vaga_regular_doutorado,
            vaga_suplementar_mestrado: vaga_suplementar_mestrado,
            vaga_suplementar_doutorado: vaga_suplementar_doutorado
        }).catch(err => {
            console.log(`[ERROR] Criar de Edital: ${err}`)
            throw new Error("Não foi possivel criar o Edital");
        });

        return edital;
    }

    async update() {}

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