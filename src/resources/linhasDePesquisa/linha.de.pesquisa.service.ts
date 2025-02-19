import { PrismaClient, LinhaPesquisa } from '@prisma/client';
const prisma = new PrismaClient();

// CRUD da pagina de linhas de pesquisa

export default new (class LinhaDePesquisaService {
  async list(): Promise<LinhaPesquisa[]> {
    return await prisma.linhaPesquisa.findMany();
  }

  async findById(id: number): Promise<LinhaPesquisa | null> {
    try {
      return await prisma.linhaPesquisa.findFirst({ where: { id } });
    } catch (error: any) {
      console.error('Erro ao buscar linha de pesquisa por id:', error);
      throw new Error(error);
    }
  }

  async findByName(name: string): Promise<LinhaPesquisa | null> {
    return await prisma.linhaPesquisa.findFirst({ where: { nome: name } });
  }

  async findBySigla(sigla: string): Promise<LinhaPesquisa | null> {
    return await prisma.linhaPesquisa.findFirst({ where: { sigla } });
  }

  async criar(newResearchLine: any): Promise<LinhaPesquisa> {
    try {
      return await prisma.linhaPesquisa.create({ data: newResearchLine });
    } catch (error: any) {
      console.error('Erro ao criar linha de pesquisa:', error);
      throw new Error(error);
    }
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
