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

        const formatedAnswer = formatDbAnswer(allResearchLines);

        return formatedAnswer;
    }
    
    async criar(newAfastamento) {
        // console.log(
        //     "Usuario id..:",usuarioId,
        //     "Local viagem:",localViagem,
        //     "Data inicio:",dataSaida,
        //     "Data fim:",dataRetorno,
        //     "Justificativa:",justificativa,
        //     "Plano reposição:",planoReposicao,
        //     "Tipo viagem:",tipoViagem,
        // );
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

}

export default new AfastamentoService();