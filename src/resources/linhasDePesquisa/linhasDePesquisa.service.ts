import { PrismaClient, LinhasDePesquisa } from "@prisma/client"
const prisma = new PrismaClient()

// CRUD da pagina de linhas de pesquisa

export default new class LinhasDePesquisaService {
  async list (): Promise<LinhasDePesquisa[]> {
    return await prisma.linhasDePesquisa.findMany()
  }

  async findById (id: number): Promise<LinhasDePesquisa | null>{
    return await prisma.linhasDePesquisa.findFirst({ where: { id } })
  }

  async findByName (name: string): Promise<LinhasDePesquisa | null>{
    return await prisma.linhasDePesquisa.findFirst({ where: { nome: name } })
  }

  async findBySigla (sigla: string): Promise<LinhasDePesquisa | null>{
    return await prisma.linhasDePesquisa.findFirst({ where: { sigla } })
  }

  async criar (newResearchLine: any): Promise<LinhasDePesquisa> {
    return await prisma.linhasDePesquisa.create({ data: newResearchLine })
  }

  async update (id: number, linhaDePesquisa: any): Promise<LinhasDePesquisa> {
    return await prisma.linhasDePesquisa.update({ where: { id }, data: linhaDePesquisa })
  }

  async delete (id: number): Promise<LinhasDePesquisa> {
    return await prisma.linhasDePesquisa.delete({ where: { id } })
  }

}()
