const { Premio } = require('../models')

class PremioService {
  async adicionarUm (
    idProfessor,
    titulo,
    ano,
    entidade
  ) {
    await Premio.destroy({
      where: {
        idProfessor
      }
    })

    await Premio.create({
      idProfessor,
      titulo,
      ano,
      entidade
    }, {})
  }

  async adicionarVarios (
    idProfessor,
    premios
  ) {
    if (premios !== undefined) {
      const premiosArr = premios.premios.map((p) => {
        return {
          idProfessor,
          entidade: p.entidade,
          titulo: p.titulo,
          ano: p.ano
        }
      })
      await Premio.destroy({
        where: {
          idProfessor
        }
      }).then(async () => {
        await Premio.bulkCreate(premiosArr)
      })
    }
  }
}

export default new PremioService()
