const {Orientacao} = require('../models');


class OrientacaoService {

  async adicionarVarios(
    idProfessor,
    orientacoes
    ){
      if(orientacoes!=undefined){
        try{
          const orientacoesArr = orientacoes["orientacoes"].map((o)=>{
            return {
                idProfessor,
                titulo: o.titulo,
                aluno: o.aluno,
                ano: o.ano,
                natureza: o.natureza,
                tipo: o.tipo,
                status: o.status,
            }
          })
          await Orientacao.destroy({
            where: {
              idProfessor: idProfessor
            },
          }).then(async ()=>{
            await Orientacao.bulkCreate(orientacoesArr)
          })
          
        }catch(err){
          throw err;
        }
      }

  }

}


export default new OrientacaoService;