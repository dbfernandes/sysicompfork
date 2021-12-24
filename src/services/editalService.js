import Edital from "../models/Edital";



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
        let edital = await Edital.findOne({where: {editalId: number}}).catch(err => {
            console.log(err);
            throw new Error("Não foi possivel criar o edital erro no find one");
        });

        if(edital){
            throw new Error("Candidato já existe");
        }

        //TO-DO Verificar se o numero do edital já existe
        edital = await Edital.create({
            editalId: number,
            vagaDoutorado: vaga_regular_doutorado,
            vagaMestrado: vaga_regular_mestrado,
            cotasDoutorado: vaga_suplementar_doutorado,
            cotasMestrado: vaga_suplementar_mestrado,
            cartaOrietador: carta_orientador,
            cartaRencomedacao: carta_recomendacao,
            documento: url,
            dataInicio: data_inicio,
            dataFim: data_fim,
            curso: "1",
            status: "created",
        }).catch(err => {
            console.log(`[ERROR] Criar de Edital: ${err}`)
            throw new Error("Não foi possivel criar o candidato");
        });

        return edital;
    }

    async update() {console.log("update")}

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