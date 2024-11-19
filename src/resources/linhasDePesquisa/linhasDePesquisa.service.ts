import { PrismaClient, LinhaDePesquisa } from '@prisma/client';
const prisma = new PrismaClient();

// CRUD da pagina de linhas de pesquisa

export default new (class LinhasDePesquisaService {
  async list(): Promise<LinhaDePesquisa[]> {
    return await prisma.linhaDePesquisa.findMany();
  }

  async findById(id: number): Promise<LinhaDePesquisa | null> {
    return await prisma.linhaDePesquisa.findFirst({ where: { id } });
  }

  async findByName(name: string): Promise<LinhaDePesquisa | null> {
    return await prisma.linhaDePesquisa.findFirst({ where: { nome: name } });
  }

  async findBySigla(sigla: string): Promise<LinhaDePesquisa | null> {
    return await prisma.linhaDePesquisa.findFirst({ where: { sigla } });
  }

  async criar(newResearchLine: any): Promise<LinhaDePesquisa> {
    return await prisma.linhaDePesquisa.create({ data: newResearchLine });
  }

  async update(id: number, linhaDePesquisa: any): Promise<LinhaDePesquisa> {
    return await prisma.linhaDePesquisa.update({
      where: { id },
      data: linhaDePesquisa,
    });
  }

  async delete(id: number): Promise<LinhaDePesquisa> {
    return await prisma.linhaDePesquisa.delete({ where: { id } });
  }
})();
