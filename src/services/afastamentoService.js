const {AfastamentoTemporario} = require('../models');

const formatDbAnswer = (object) => {
    const array = Array.isArray(object);
  
    switch(array) {
    case (true): {
      return object.map((linha) => (linha.dataValues));
    };
  
    case (false): {
      return object.dataValues;
    };
  
    default:
      return object.dataValues;
    };
};
class AfastamentoService
{ 
    
    async listar() {
        const allResearchLines = await AfastamentoTemporario.findAll({});
        // console.log(allResearchLines);
        const formatedAnswer = formatDbAnswer(allResearchLines);
        console.log(formatedAnswer);
        const dataFormatada = formatedAnswer.map((afastamento) => {
            afastamento["createdAt"] = new Date(afastamento["createdAt"]).toLocaleDateString("pt-BR", {
                timeZone: 'America/Manaus',
            }).slice(0,10);
            afastamento["dataSaida"] = new Date(afastamento["dataSaida"]).toLocaleDateString("pt-BR", {
                timeZone: 'America/Manaus',
            }).slice(0,10);
            afastamento["dataRetorno"] = new Date(afastamento["dataRetorno"]).toLocaleDateString("pt-BR", {
                timeZone: 'America/Manaus',
            }).slice(0,10);
            return afastamento;
        });
        return dataFormatada;
    }
    
    async criar(newAfastamento) {
        const {dataSaida, dataRetorno, tipoViagem, localViagem, justificativa, planoReposicao} = newAfastamento;
        await AfastamentoTemporario.create({
            dataSaida,
            dataRetorno,
            tipoViagem,
            localViagem,
            justificativa,
            planoReposicao,
        });
    }

    async vizualizar(id) {
        const afastamento = await AfastamentoTemporario.findByPk(id);
        const dataFormatada = afastamento.get()
        dataFormatada["createdAt"] = new Date(dataFormatada["createdAt"]).toLocaleDateString("pt-BR", {
            timeZone: 'America/Manaus',
        }).slice(0,10);
        dataFormatada["dataSaida"] = new Date(dataFormatada["dataSaida"]).toLocaleDateString("pt-BR", {
            timeZone: 'America/Manaus',
        }).slice(0,10);
        dataFormatada["dataRetorno"] = new Date(dataFormatada["dataRetorno"]).toLocaleDateString("pt-BR", {
            timeZone: 'America/Manaus',
        }).slice(0,10);
        // const formatedAnswer = formatDbAnswer(dataFormatada);
        return dataFormatada;
    }

}

export default new AfastamentoService();