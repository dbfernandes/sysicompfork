const { AfastamentoTemporario } = require('../models')

interface AfastamentoTemporario {
  usuarioId: string
  usuarioNome: string
  dataSaida: string
  dataRetorno: string
  tipoViagem: string
  localViagem: string
  justificativa: string
  planoReposicao: string
  createdAt: any
}

const formatDbAnswer = (object: any) => {
  const array = Array.isArray(object)

  return array ? object.map((linha) => (linha.dataValues)) : object.dataValues
}
class AfastamentoService {
  async listar (id:string) {
    const allResearchLines = await AfastamentoTemporario.findAll({
      where: {
        usuarioId: id
      }
    })
    // console.log(allResearchLines);
    const formatedAnswer = formatDbAnswer(allResearchLines)
    const dataFormatada = formatedAnswer.map((afastamento: AfastamentoTemporario) => {
      afastamento.createdAt = new Date(afastamento.createdAt).toLocaleDateString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
      afastamento.dataSaida = new Date(afastamento.dataSaida).toLocaleDateString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
      afastamento.dataRetorno = new Date(afastamento.dataRetorno).toLocaleDateString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
      return afastamento
    })
    return dataFormatada
  }

  async listarTodos () {
    const allResearchLines = await AfastamentoTemporario.findAll()
    // console.log(allResearchLines);
    const formatedAnswer = formatDbAnswer(allResearchLines)
    const dataFormatada = formatedAnswer.map((afastamento: AfastamentoTemporario) => {
      afastamento.createdAt = new Date(afastamento.createdAt).toLocaleDateString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
      afastamento.dataSaida = new Date(afastamento.dataSaida).toLocaleDateString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
      afastamento.dataRetorno = new Date(afastamento.dataRetorno).toLocaleDateString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
      return afastamento
    })
    return dataFormatada
  }

  async criar (newAfastamento: AfastamentoTemporario) {
    const { usuarioId, usuarioNome, dataSaida, dataRetorno, tipoViagem, localViagem, justificativa, planoReposicao } = newAfastamento
    await AfastamentoTemporario.create({
      usuarioId,
      usuarioNome,
      dataSaida,
      dataRetorno,
      tipoViagem,
      localViagem,
      justificativa,
      planoReposicao
    })
  }

  async pegarAfastamento (id:string) {
    const afastamento = await AfastamentoTemporario.findByPk(id)
    return afastamento
  }

  async vizualizar (id:string) {
    const afastamento = await AfastamentoTemporario.findByPk(id)
    const dataFormatada = afastamento.get()
    dataFormatada.createdAt = new Date(dataFormatada.createdAt).toLocaleDateString('pt-BR', {
      timeZone: 'America/Manaus'
    }).slice(0, 10)
    dataFormatada.dataSaida = new Date(dataFormatada.dataSaida).toLocaleDateString('pt-BR', {
      timeZone: 'America/Manaus'
    }).slice(0, 10)
    dataFormatada.dataRetorno = new Date(dataFormatada.dataRetorno).toLocaleDateString('pt-BR', {
      timeZone: 'America/Manaus'
    }).slice(0, 10)
    // const formatedAnswer = formatDbAnswer(dataFormatada);
    return dataFormatada
  }

  async delete (id:string) {
    await AfastamentoTemporario.destroy({
      where: {
        id
      }
    })
  }
}

export default new AfastamentoService()
