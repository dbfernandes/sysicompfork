import sequelize, { Op } from 'sequelize'
import { distance } from 'fastest-levenshtein'

import getPublicationsArr from '../../utils/listaPublicacoes'
const { Publicacao, Usuario, TipoPublicacao, RelUsuarioPublicacao } = require('../../models')
/* eslint-disable eqeqeq */
class PublicacaoService {
  async adicionarVarios (
    idProfessor,
    publicacoes
  ) {
    if (publicacoes !== undefined) {
      let tipos = await TipoPublicacao.findAll()
      tipos = tipos.map((tipo) => {
        return tipo.dataValues
      })
      const publicArr = await getPublicationsArr(publicacoes, idProfessor, tipos)
      const professor = await Usuario.findByPk(idProfessor, {
        attributes: ['id'],
        include: {
          attributes: ['id'],
          model: Publicacao,
          as: 'Publicacoes',
          raw: true
        }
      })
      const publicacoesExistentes = professor.dataValues.Publicacoes
      if (publicacoesExistentes.length > 0) {
        const idPublicacoesExistentes = publicacoesExistentes.length > 1
          ? publicacoesExistentes.map(p => p.dataValues.id)
          : publicacoesExistentes.dataValues.id
        const idPublicacoesAExcluir = idPublicacoesExistentes
        const todasRelacoes = await RelUsuarioPublicacao.findAll({
          where: {
            idPublicacao: idPublicacoesExistentes
          }
        })
        publicacoesExistentes.forEach(async publication => {
          const publicacaoId = publication.dataValues.id
          const outraRelacao = todasRelacoes.find((e) =>
            e.dataValues.idPublicacao == publicacaoId && e.dataValues.idUsuario != idProfessor)
          if (outraRelacao) {
            const idxPublicAExcluir = idPublicacoesAExcluir.findIndex(e => e == publicacaoId)
            idPublicacoesAExcluir.splice(idxPublicAExcluir, idxPublicAExcluir + 1)
          }
        })
        idPublicacoesExistentes.forEach(async id => {
          await professor.removePublicacoes(id)
        })
        await Publicacao.destroy({
          where: {
            id: idPublicacoesAExcluir
          }
        })
      }
      publicArr.forEach(async publicacao => {
        const publicacoesMesmoAno = await Publicacao.findAll({
          attributes: ['id', 'titulo'],
          where: {
            ano: publicacao.ano
          }
        })
        let unicaPublicacao = null
        publicacoesMesmoAno.every(p => {
          if (distance(p.dataValues.titulo, publicacao.titulo) <= 3) {
            unicaPublicacao = p
            return false
          }
          return true
        })

        if (!unicaPublicacao) {
          unicaPublicacao = await Publicacao.create(publicacao)
        }
        await professor.addPublicacoes(unicaPublicacao.dataValues.id)
      })
    }
  }

  async listarTodos (conditions) {
    const params = {
      include: {
        model: TipoPublicacao,
        as: 'Tipo'
      },
      where: conditions || {}
    }
    const publicacoes = await Publicacao.findAll(params)
    return publicacoes.length > 0 ? publicacoes.map(p => p.get()) : publicacoes
  }

  async contarTodos () {
    const currentYear = new Date().getFullYear()
    const anos = [...Array(15).keys()].map(i => i + currentYear - 14)
    const count = await Publicacao.findAll({
      where: {
        tipo: [1, 2],
        ano: {
          [Op.gt]: currentYear - 15
        }
      },
      attributes: ['ano', 'tipo',
        [sequelize.fn('COUNT', sequelize.col('ano')), 'count']],
      group: ['ano', 'tipo'],
      raw: true
    })
    const countConferencias = count.filter(item => {
      return item.tipo === 1
    })
    const countPeriodicos = count.filter(item => {
      return item.tipo === 2
    })
    const contagemTotal = {
      Conferencia: [],
      Periodico: []
    }
    anos.forEach(ano => {
      let conferenciaYearlyCount = 0
      let periodicoYearlyCount = 0
      countConferencias.every(item => {
        if (item.ano === ano) {
          conferenciaYearlyCount = item.count
          return false
        }
        return true
      })
      countPeriodicos.every(item => {
        if (item.ano === ano) {
          periodicoYearlyCount = item.count
          return false
        }
        return true
      })
      contagemTotal.Conferencia.push(conferenciaYearlyCount)
      contagemTotal.Periodico.push(periodicoYearlyCount)
    })

    return {
      contagemTotal,
      anos
    }
  }
}

export default new PublicacaoService()
