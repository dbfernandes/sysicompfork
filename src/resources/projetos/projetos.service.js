// const { Projeto } = require('../models')
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class ProjetoService {
  async adicionarVarios (
    idProfessor,
    projetos
  ) {
    if (projetos !== undefined) {
      const projetosArr = projetos.projetos.map((p) => {
        return {
          idProfessor,
          descricao: p.descricao,
          fim: p.fim,
          inicio: p.inicio,
          papel: p.papel,
          titulo: p.titulo,
          financiadores: p.financiadores,
          integrantes: p.integrantes
        }
      })
      await prisma.projeto.deleteMany({
        where: {
          idProfessor
        }
      }).then(async () => {
        await prisma.projeto.createMany({
          data: projetosArr
        })
      })
    }
  }

  async listarAtuais () {
    let projetos = await prisma.projeto.findMany({
      where: {
        fim: 0
      }
    })
    projetos = projetos.length > 0 ? projetos.map((p) => p.get()) : null
    const projetosFiltrados = []
    if (projetos) {
      projetos.forEach((projeto) => {
        let flag = true
        projetosFiltrados.every((p) => {
          flag = p.titulo == projeto.titulo || (p.descricao == projeto.descricao && projeto.descricao != '') && p.id != projeto.id ? false : flag
          return flag
        })
        if (flag) {
          projetosFiltrados.push(projeto)
        }
      })
    }
    return projetosFiltrados
  }
}

export default new ProjetoService()
