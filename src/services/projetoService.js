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

  async listarAtuais(){
    try {
      var projetos = await Projeto.findAll({
        where: {
          fim: 0,
        },
      })
      projetos = projetos.length > 0 ?  projetos.map((p)=>p.get()) : null
      const projetosFiltrados = []
      if(projetos){
        projetos.forEach((projeto)=>{
          var flag = true
          projetosFiltrados.every((p)=>{
            flag = p.titulo == projeto.titulo || (p.descricao == projeto.descricao && projeto.descricao != "") && p.id != projeto.id ? false : flag
            return flag
          })
          if(flag){
            projetosFiltrados.push(projeto)
          }
        })
      }
      return projetosFiltrados

    } catch (error) {
      throw error
    }
  }

}


export default new ProjetoService;