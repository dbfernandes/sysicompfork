import Candidate from '../models/Candidate';

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
        const edital = await Edital.findOne({
            where: {
                editalId: id
            }
        }).catch(err => {
            console.log(`[ERROR] Buscar Edital: ${err}`)
            throw new Error("Não foi possivel buscar o edital");
        })

        if (!edital) {
            throw new Error("Edital não encontrado");
        }

        await Edital.destroy({
            where: {
                editalId : id
            }
        }).catch(err => {
            console.log(`[ERROR] Deletar Edital: ${err}`)
            throw new Error("Não foi possivel deletar o edital");
        })

        return edital;
    }

    async getEdital(id) {
        const edital = await Edital.findOne({
            where: {
                editalId: id
            }
        }).catch(err => {
            console.log(`[ERROR] Buscar Edital: ${err}`)
            throw new Error("Não foi possivel buscar o edital");
        })
        


        return edital;
    }

    async update(id_update, {
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

        const edital = await Edital.findOne({
            where: {
                editalId: id_update
            }
        }).catch(err => {

            console.log(`[ERROR] Buscar Edital: ${err}`)
            console.log('{this.id_update}', id_update)
            throw new Error("Não foi possivel buscar o edital");
        })

        if (!edital) {
            throw new Error("Edital não encontrado");
        }

        await Edital.update({
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
        }, {
            where: {
                editalId: id_update
            }
        }).catch(err => {
            console.log(`[ERROR] Atualizar Edital: ${err}`)
            throw new Error("Não foi possivel atualizar o edital");
        })

        return edital;
    }

    async getEditalByNumber(number) {
        const edital = await Edital.findOne({
            where: {
                editalId: number
            }
        }).catch(err => {
            console.log(`[ERROR] Buscar Edital: ${err}`)
            throw new Error("Não foi possivel buscar o edital");
        })

        return edital;
    }

    async listCandidates(id){
        const candidates= await Candidate.findAll({
            where:{
                editalId:id
            }
        }).catch(err=>{
            console.log(`[ERROR] Buscar candidatos: ${err}`);
            throw new Error("Não foi possivel buscar candidatos");

        })
    }
}

export default new EditalService;