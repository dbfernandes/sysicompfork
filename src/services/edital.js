class EditalService {



    async create({
        nome,
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
    }) { // criar novos editais
        
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