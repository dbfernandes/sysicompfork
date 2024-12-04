import { PrismaClient, LinhasDePesquisa } from "@prisma/client"
const prisma = new PrismaClient()

// CRUD da pagina de linhas de pesquisa

export default new class LinhasDePesquisaService {
  async list(): Promise<LinhasDePesquisa[]> {
    try {
      return await prisma.linhasDePesquisa.findMany();
    } catch (error) {
      throw new Error('Erro ao listar as linhas de pesquisa.');
    }
  }

  async findById(id: number): Promise<LinhasDePesquisa | null> {
    try {
      const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({ where: { id } });
      if (!linhaDePesquisa) {
        throw new Error(`Linha de pesquisa com ID ${id} não encontrada.`);
      }
      return linhaDePesquisa;
    } catch (error) {
      throw new Error(`Erro ao buscar linha de pesquisa por ID: ${error.message}`);
    }
  }

  async findByName(name: string): Promise<LinhasDePesquisa | null> {
    try {
      const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({ where: { nome: name } });
      if (!linhaDePesquisa) {
        throw new Error(`Linha de pesquisa com o nome "${name}" não encontrada.`);
      }
      return linhaDePesquisa;
    } catch (error) {
      throw new Error(`Erro ao buscar linha de pesquisa por nome: ${error.message}`);
    }
  }

  async findBySigla(sigla: string): Promise<LinhasDePesquisa | null> {
    try {
      const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({ where: { sigla } });
      if (!linhaDePesquisa) {
        throw new Error(`Linha de pesquisa com a sigla "${sigla}" não encontrada.`);
      }
      return linhaDePesquisa;
    } catch (error) {
      throw new Error(`Erro ao buscar linha de pesquisa por sigla: ${error.message}`);
    }
  }

  async criar(newResearchLine: any): Promise<LinhasDePesquisa> {
    try {
      return await prisma.linhasDePesquisa.create({ data: newResearchLine });
    } catch (error) {
      throw new Error(`Erro ao criar uma nova linha de pesquisa: ${error.message}`);
    }
  }

  async update(id: number, linhaDePesquisa: any): Promise<LinhasDePesquisa> {
    try {
      const linhaExistente = await this.findById(id);
      if (!linhaExistente) {
        throw new Error(`Linha de pesquisa com ID ${id} não encontrada para atualização.`);
      }

      return await prisma.linhasDePesquisa.update({
        where: { id },
        data: linhaDePesquisa,
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar a linha de pesquisa com ID ${id}: ${error.message}`);
    }
  }

  async delete(id: number): Promise<LinhasDePesquisa> {
    try {
      const linhaExistente = await this.findById(id);
      if (!linhaExistente) {
        throw new Error(`Linha de pesquisa com ID ${id} não encontrada para exclusão.`);
      }

      return await prisma.linhasDePesquisa.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Erro ao deletar a linha de pesquisa com ID ${id}: ${error.message}`);
    }
  }
};
