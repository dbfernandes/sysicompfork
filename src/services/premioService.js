const {Premio} = require('../models');


class PremioService {
  async adicionarUm(
    idProfessor,
    titulo,
    ano,
    entidade,
  ){
      try{
        await Premio.destroy({
          where: {
            idProfessor: idProfessor
          },
        });

        await Premio.create({
          idProfessor,
          titulo,
          ano,
          entidade,
      }, {})
      }catch(err){
        throw err;
      }

  }

  async adicionarVarios(
    idProfessor,
    premios
    ){
      if(premios!=undefined){
        try{
          const premiosArr = premios["premios"].map((p)=>{
            return {
                idProfessor,
                entidade: p.entidade,
                titulo: p.titulo,
                ano: p.ano
            }
          })
          await Premio.destroy({
            where: {
              idProfessor: idProfessor
            },
          }).then(async ()=>{
            await Premio.bulkCreate(premiosArr)
          })
          
        }catch(err){
          throw err;
        }
      }

  }

}


export default new PremioService;