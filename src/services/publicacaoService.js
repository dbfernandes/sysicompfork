const {Publicacao} = require('../models');

class PublicacaoService {
  async adicionarUm(
    id,
    idProfessor,
    titulo,
    ano,
    local,
    tipo,
    natureza,
    autores,
    ISSN
  ){
      try{
        await Publicacao.destroy({
          where: {
            idProfessor: idProfessor
          },
        });

        await Publicacao.create({
          id,
          idProfessor,
          titulo,
          ano,
          local,
          tipo,
          natureza,
          autores,
          ISSN
      }, {})
      }catch(err){
        throw err;
      }

  }

  async adicionarVarios(
    idProfessor,
    publicacoes
  ){
      if(publicacoes!=undefined){

        const artigosPeriodico = publicacoes["ARTIGO-PUBLICADO"]
        const artigosEventos = publicacoes["TRABALHO-EM-EVENTOS"]
        const livros = publicacoes["LIVRO-PUBLICADO-OU-ORGANIZADO"]
        const capituloLivro = publicacoes["CAPITULO-DE-LIVRO-PUBLICADO"]
        let publicArr = []
        if(artigosPeriodico != undefined){
          for (var k in artigosPeriodico){
            publicArr.push({
              idProfessor: idProfessor,
              titulo: artigosPeriodico[k].titulo,
              ano: artigosPeriodico[k].ano!="" ? parseInt(artigosPeriodico[k].ano) : 0,
              local: artigosPeriodico[k].local,
              tipo: 1,
              natureza: artigosPeriodico[k].natureza,
              autores: artigosPeriodico[k].autores.nomeCompleto.join("; "),
              ISSN: artigosPeriodico[k].issn!="" ? parseInt(artigosPeriodico[k].issn) : 0
            })
          }
        }
        if(artigosEventos != undefined){
          for (var k in artigosEventos){
            publicArr.push({
              idProfessor: idProfessor,
              titulo: artigosEventos[k].titulo,
              ano: artigosEventos[k].ano!="" ? parseInt(artigosEventos[k].ano) : 0,
              local: artigosEventos[k].local,
              tipo: 2,
              natureza: artigosEventos[k].natureza,
              autores: artigosEventos[k].autores.nomeCompleto.join("; "),
              ISSN: artigosEventos[k].issn!="" ? parseInt(artigosEventos[k].issn) : 0
            })
          }
        }
        if(livros != undefined){
          for (var k in livros){
            publicArr.push({
              idProfessor: idProfessor,
              titulo: livros[k].titulo,
              ano: livros[k].ano!="" ? parseInt(livros[k].ano) : 0,
              local: livros[k].local,
              tipo: 3,
              natureza: livros[k].natureza,
              autores: livros[k].autores.nomeCompleto.join("; "),
              ISSN: livros[k].issn!="" ? parseInt(livros[k].issn) : 0
            })
          }
        }
        if(capituloLivro != undefined){
          for (var k in capituloLivro){
            publicArr.push({
              idProfessor: idProfessor,
              titulo: capituloLivro[k].titulo,
              ano: capituloLivro[k].ano!="" ? parseInt(capituloLivro[k].ano) : 0,
              local: capituloLivro[k].local,
              tipo: 4,
              natureza: capituloLivro[k].natureza,
              autores: capituloLivro[k].autores.nomeCompleto.join("; "),
              ISSN: capituloLivro[k].issn!="" ? capituloLivro[k].issn : 0
            })
          }
        }
        console.log(publicArr)
        try{
          await Publicacao.destroy({
            where: {
              idProfessor: idProfessor
            },
          }).then(()=>{
            Publicacao.bulkCreate(publicArr)
          }
          )
          
        }catch(err){
          throw err;
        }
      }

  }

}


export default new PublicacaoService;