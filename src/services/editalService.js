var {
    Edital
} = require('../models');

class EditalService {
    async create({
        number,
        documento,
        data_inicio,
        data_fim,
        carta_recomendacao,
        carta_orientador,
        vaga_regular_mestrado,
        vaga_regular_doutorado,
        vaga_suplementar_mestrado,
        vaga_suplementar_doutorado
    }) {


        let edital = await Edital.findOne({
            where: {
                editalId: number
            }
        }).catch(err => {
            console.log(err);
            throw new Error("Não foi possivel criar o edital erro na busca");
        });

        if (edital) {
            throw new Error("Candidato já existe");
        }

        edital = await Edital.create({
            editalId: number,
            vagaDoutorado: vaga_regular_doutorado,
            vagaMestrado: vaga_regular_mestrado,
            cotasDoutorado: vaga_suplementar_doutorado,
            cotasMestrado: vaga_suplementar_mestrado,
            cartaOrientador: carta_orientador,
            cartaRecomendacao: carta_recomendacao,
            documento: documento,
            dataInicio: data_inicio,
            dataFim: data_fim,
            curso: "1",
            status: "created",
        }).catch(err => {
            console.log(`[ERROR] Criar de Edital: ${err}`)
            throw new Error("Não foi possivel criar o Edital");
        });

        return edital;
    }


    async listEdital() {
        // listagem dos editais
        const editais = await Edital.findAll().catch(err => {
            console.log(`[ERROR] Listar Editais: ${err}`)
            throw new Error("Não foi possivel listar o edital");
        })
        return editais;
    }

    async delete(id) {
        await Edital.destroy({
            where: {
                editalId:id
            },
        });
    }
}

export default new EditalService;