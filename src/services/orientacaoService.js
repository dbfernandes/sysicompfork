const { Orientacao } = require('../models')

class OrientacaoService {
  async adicionarVarios (
    idProfessor,
    orientacoes
  ) {
    if (orientacoes !== undefined) {
      const orientacoesArr = orientacoes.orientacoes.map((o) => {
        return {
          idProfessor,
          titulo: o.titulo,
          aluno: o.aluno,
          ano: o.ano,
          natureza: o.natureza,
          tipo: o.tipo,
          status: o.status
        }
      })
      await Orientacao.destroy({
        where: {
          idProfessor
        }
      }).then(async () => {
        await Orientacao.bulkCreate(orientacoesArr)
      })
    }
  }
}

export default new OrientacaoService()
