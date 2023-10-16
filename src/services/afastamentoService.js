const {Afastamento} = require('../models/AfastamentoTemporario');

class AfastamentoService
{ 
    async create({
        localViagem,
        dataInicio,
        dataFim,
        justificativa,
        plano,
        idUsuario,
        tipoViagem,
    }) {
        const afastamento = await Afastamento.create({
            usuarioId: idUsuario,
            dataSaida: dataInicio,
            dataRetorno: dataFim,
            tipoViagem: tipoViagem,
            localViagem: localViagem,
            justificativa: justificativa,
            planoReposicao: plano,
        }).catch(err => {
            console.log(`[ERROR] Criar de afastamento: ${err}`)
            throw new Error("Não foi possivel criar o afastamento erro no create");
        })

        return afastamento;
    }

    async listar() {
        const afastamentos = await Afastamento.findAll().catch(err => {
            console.log(`[ERROR] Listar afastamentos: ${err}`)
            throw new Error("Não foi possivel listar o afastamento");
        })
        return afastamentos;
    }
}

export default new AfastamentoService();