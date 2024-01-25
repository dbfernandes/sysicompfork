const {Publicacao, Usuario, TipoPublicacao, RelUsuarioPublicacao} = require('../models');
import { distance } from 'fastest-levenshtein';

import getPublicationsArr from '../utils/lista-publicacoes';

class PublicacaoService {

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
          const professor = await Usuario.findByPk(idProfessor, {
            include: {
              model: Publicacao,
              as: 'Publicacoes',
          }
          })
          if(professor.dataValues.Publicacoes.length > 0){
            const relations = await RelUsuarioPublicacao.findAll({
              where: {
                idUsuario: idProfessor
              }
            })
            relations.forEach(async relation => {
              const publicacaoId = relation.dataValues.idPublicacao
              await relation.destroy()
              const outraRelacao = await RelUsuarioPublicacao.findOne({
                where: {
                  idPublicacao: publicacaoId
                }
              })
              if(!outraRelacao){
                await Publicacao.destroy({
                  where: {
                    id: publicacaoId
                  }
                })
              }
            })
          }
          publicArr.forEach(async publicacao => {
            const publicacoesMesmoAno = await Publicacao.findAll({
              attributes: ["id", "titulo"],
              where: {
                ano: publicacao.ano
              }
            })
            let unicaPublicacao = null
            publicacoesMesmoAno.every(p=>{
              if(distance(p.dataValues.titulo, publicacao.titulo)<=3){
                unicaPublicacao = p
                return false;
              }
              return true
            })
            if(!unicaPublicacao){
              unicaPublicacao = await Publicacao.create(publicacao)
            }
            await professor.addPublicacoes(unicaPublicacao.dataValues.id)
          })
          
        }catch(err){
          throw err;
        }
      }

  }

  async listarTodos(conditions=null){
    try {
      const publicacoes = await Publicacao.findAll(conditions ? { where: conditions } : {})

      return publicacoes.length > 0 ? publicacoes.map(p=>p.get()) : publicacoes
    } catch (error) {
      throw err;
    }
  }

}


export default new PublicacaoService;