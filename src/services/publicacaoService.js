const {Publicacao} = require('../models');
const {TipoPublicacao} = require('../models');

import getPublicationsArr from '../utils/lista-publicacoes';

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
        try{
          var tipos = await TipoPublicacao.findAll()
          tipos = tipos.map((tipo) => {
            return tipo.dataValues;
          })
          const publicArr = await getPublicationsArr(publicacoes, idProfessor, tipos)
          console.log(publicArr)
          await Publicacao.destroy({
            where: {
              idProfessor: idProfessor
            },
          }).then(async ()=>{
            await Publicacao.bulkCreate(publicArr)
          })
          
        }catch(err){
          throw err;
        }
      }

  }

}


export default new PublicacaoService;