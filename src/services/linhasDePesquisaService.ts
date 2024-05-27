import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// CRUD da pagina de linhas de pesquisa

export default new class LinhasDePesquisaService {
  async list() {
    try {
      const linhasDePesquisa = await prisma.linhasDePesquisa.findMany()
      return linhasDePesquisa
    } catch (error: any) {
      console.log(error.message || 'Não foi possível listar as linhas de pesquisa!')
    }
  }

  async findById(id: number) {
    try {
      const researchLine = await prisma.linhasDePesquisa.findFirst({
        where: {
          id
        }
      })
      return researchLine
    } catch (error: any) {
      console.log(error.message || 'Não foi possível encontrar a linha de pesquisa!')
    }
  }

  async findByName(name: string) {
    try {
      const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({
        where: {
          nome: name
        }
      })
      return linhaDePesquisa
    } catch (error: any) {
      console.log(error.message || 'Não foi possível encontrar a linha de pesquisa!')
    }
  }

  async findBySigla(sigla: string) {
    try {
      const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({
        where: {
          sigla
        }
      })
      return linhaDePesquisa
    } catch (error: any) {
      console.log(error.message || 'Não foi possível encontrar a linha de pesquisa!')
    }
  }

  async criar(newResearchLine: Prisma.LinhasDePesquisaCreateInput) {
    try {
      const { nome, sigla } = newResearchLine
      await prisma.linhasDePesquisa.create({
        data: {
          nome,
          sigla
        }
      })
    } catch (error: any) {
      console.log(error.message || 'Não foi possível criar a linha de pesquisa!')
    }
  }

  async update(id: number, newInfo: Prisma.LinhasDePesquisaUpdateInput) {
    try {
      const { nome, sigla } = newInfo
      await prisma.linhasDePesquisa.update({
        where: {
          id
        },
        data: {
          nome,
          sigla,
          updatedAt: new Date()
        }
      })
    } catch (error: any) {
      console.log(error.message || 'Não foi possível atualizar a linha de pesquisa!')
    }
  }

  async delete(id: number) {
    try {
      await prisma.linhasDePesquisa.delete({
        where: {
          id
        }
      })
    } catch (error: any) {
      console.log(error.message || 'Não foi possível deletar a linha de pesquisa!')
    }
  }
}();
