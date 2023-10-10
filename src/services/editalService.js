import Candidate from '../models/Candidate';

var {
    Edital
} = require('../models');

class EditalService {
    async criarEdital({
        num_edital,
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
                editalId: num_edital
            }
        });

        if (edital) {
            console.log("edital ja existe");
            throw new Error(`Edital de número ${num_edital} já existe`);
        }

        try {
            const novo_edital = await Edital.create({
                editalId: num_edital,
                vagaDoutorado: vaga_regular_doutorado,
                vagaMestrado: vaga_regular_mestrado,
                cotasDoutorado: vaga_suplementar_doutorado,
                cotasMestrado: vaga_suplementar_mestrado,
                cartaOrientador: carta_orientador,
                cartaRecomendacao: carta_recomendacao,
                documento: documento,
                dataInicio: data_inicio,
                dataFim: data_fim,                
                status: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        
            return novo_edital;
        } catch (error) {
            console.log(`[ERROR] Criar Edital: ${error}`);
            throw new Error("Não foi possível criar o Edital");
        }
      
        
    }


    async listEdital() {
        // listagem dos editais
        console.log('ta listado')
        const editais = await Edital.findAll().catch(err => {
            console.log(`[ERROR] Listar Editais: ${err}`)
            throw new Error("Não foi possivel listar o edital");
        })


        return editais;
    }

    async delete(id) {
        try {
            const edital = await Edital.findOne({
                where: {
                    editalId: id
                }
            });
    
            if (!edital) {
                console.log("Edital não existe");
                throw new Error(`Não existe edital de número ${id}`);
            }
    
            edital.status = 0;
            await edital.save();
    
            return edital;
        } catch (error) {
            console.error("Erro ao arquivar edital:", error);
            throw new Error(error);
        }
    }

    async arquivar(id_edital, {
        status
    }) {

        const edital = await Edital.findOne({
            where: {
                editalId: id_edital
            }
        }).catch(err => {

            console.log(`[ERROR] Buscar Edital: ${err}`)
            console.log('{this.id_update}', id_edital)
            throw new Error("Não foi possivel buscar o edital");
        })

        if (!edital) {
            throw new Error("Edital não encontrado");
        }

        await Edital.update({
            status,
            updatedAt: new Date(),
        }, {
            where: {
                editalId: id_edital
            }
        }).catch(err => {
            console.log(`[ERROR] Atualizar Edital: ${err}`)
            throw new Error("Não foi possivel alterar o status do edital");
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
        num_edital,
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
            editalId: num_edital,
            vagaDoutorado: vaga_regular_doutorado,
            vagaMestrado: vaga_regular_mestrado,
            cotasDoutorado: vaga_suplementar_doutorado,
            cotasMestrado: vaga_suplementar_mestrado,
            cartaOrientador: carta_orientador,
            cartaRecomendacao: carta_recomendacao,
            documento: documento,
            dataInicio: data_inicio,
            dataFim: data_fim,
            status: "1",
            updatedAt: new Date(),
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