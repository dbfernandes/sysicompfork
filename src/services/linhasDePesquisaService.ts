import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// CRUD da pagina de linhas de pesquisa

export default new class LinhasDePesquisaService {
  async list() {
    const linhasDePesquisa = await prisma.linhasDePesquisa.findMany();
    return linhasDePesquisa;
  }

  async findById(id: number) {
    const researchLine = await prisma.linhasDePesquisa.findFirst({
      where: {
        id
      }
    });
    return researchLine;
  }

  async findByName(name: string) {
    const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({
      where: {
        nome: name
      }
    });
    return linhaDePesquisa;
  }

  async findBySigla(sigla: string) {
    const linhaDePesquisa = await prisma.linhasDePesquisa.findFirst({
      where: {
        sigla
      }
    });
    return linhaDePesquisa;
  }

  async criar(nome: string, sigla: string) {
    await prisma.linhasDePesquisa.create({
      data: {
        nome,
        sigla,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async update(id: number, newInfo: Prisma.LinhasDePesquisaUpdateInput) {
    const { nome, sigla } = newInfo;
    await prisma.linhasDePesquisa.update({
      where: {
        id
      },
      data: {
        nome,
        sigla,
        updatedAt: new Date()
      }
    });
  }

  async delete(id: number) {
    await prisma.linhasDePesquisa.delete({
      where: {
        id
      }
    });
  }
}();
