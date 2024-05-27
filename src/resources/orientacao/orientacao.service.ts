// const { Orientacao } = require('../models')
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class OrientacaoService {
  async adicionarVarios (
    idProfessor: number,
    orientacoes: any
  ) {
    if (orientacoes !== undefined) {
      const orientacoesArr = orientacoes.orientacoes.map((o: any) => {
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
      // await Orientacao.destroy({
      //   where: {
      //     idProfessor
      //   }
      // }).then(async () => {
      //   await Orientacao.bulkCreate(orientacoesArr)
      // })
      await prisma.orientacao.deleteMany({
        where: {
          idProfessor
        }
      }).then(async () => {
        await prisma.orientacao.createMany({
          data: orientacoesArr
        })
      })
    }
  }
}

export default new OrientacaoService()
