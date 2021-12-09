class EditalService {

    async create(){ // criar novos editais

    }

    async list(){ // listagem dos editais

        const editais = [
            {
                number: "000-0002",
                begin: new Date(),
                finish: new Date(),
                vagasDoutorado: 4,
                vagasMestrado: 3,
            }
        ]

        return editais;
    }

}

export default new EditalService;