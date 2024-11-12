import { PrismaClient, LinhaPesquisa } from '@prisma/client';
const prisma = new PrismaClient();

// CRUD da pagina de linhas de pesquisa

export default new (class LinhaDePesquisaService {
  async list(): Promise<LinhaPesquisa[]> {
    return await prisma.linhaPesquisa.findMany();
  }

  async findById(id: number): Promise<LinhaPesquisa | null> {
    return await prisma.linhaPesquisa.findFirst({ where: { id } });
  }

  async findByName(name: string): Promise<LinhaPesquisa | null> {
    return await prisma.linhaPesquisa.findFirst({ where: { nome: name } });
  }

  async findBySigla(sigla: string): Promise<LinhaPesquisa | null> {
    return await prisma.linhaPesquisa.findFirst({ where: { sigla } });
  }

  async criar(newResearchLine: any): Promise<LinhaPesquisa> {
    return await prisma.linhaPesquisa.create({ data: newResearchLine });
  }

  async update(id: number, linhaDePesquisa: any): Promise<LinhaPesquisa> {
    return await prisma.linhaPesquisa.update({
      where: { id },
      data: linhaDePesquisa,
    });
  }

  async delete(id: number): Promise<LinhaPesquisa> {
    return await prisma.linhaPesquisa.delete({ where: { id } });
  }
})();
