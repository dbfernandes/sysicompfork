const {Projeto} = require('../models');


class ProjetoService {

  async adicionarVarios(
    idProfessor,
    projetos
    ){
      if(projetos!=undefined){
        try{
          const projetosArr = projetos["projetos"].map((p)=>{
            return {
                idProfessor,
                descricao: p.descricao,
                fim: p.fim,
                inicio: p.inicio,
                papel: p.papel,
                titulo: p.titulo,
                financiadores: p.financiadores,
                integrantes: p.integrantes,
            }
          })
          await Projeto.destroy({
            where: {
              idProfessor: idProfessor
            },
          }).then(async ()=>{
            await Projeto.bulkCreate(projetosArr)
          })
          
        }catch(err){
          throw err;
        }
      }

  }

}


export default new ProjetoService;