import { PrismaClient, Salas } from "@prisma/client";

const prisma = new PrismaClient();

export default new (class SalaService {
  // Pegar todas as Salas
  async listarTodos(): Promise<Salas[]> {
    try {
      return await prisma.salas.findMany();
    } catch (error: any) {
      throw new Error('Erro ao listar todas as salas.');
    }
  }

  // Pegar uma sala
  async listarUmaSala(id: number): Promise<Salas | null> {
    try {
      return await prisma.salas.findUnique({ where: { id } });
    } catch (error: any) {
      throw new Error(`Erro ao buscar a sala com ID ${id}.`);
    }
  }

  // Criar salas
  async criar(sala: any): Promise<Salas> {
    try {
      return await prisma.salas.create({ data: sala });
    } catch (error: any) {
      throw new Error('Erro ao criar uma nova sala.');
    }
  }

  // Editar salas
  async editar(id: number, sala: any): Promise<Salas> {
    try {
      return await prisma.salas.update({ where: { id }, data: sala });
    } catch (error: any) {
      throw new Error(`Erro ao editar a sala com ID ${id}.`);
    }
  }

  // Excluir salas
  async excluir(id: number): Promise<Salas> {
    try {
      return await prisma.salas.delete({ where: { id } });
    } catch (error: any) {
      throw new Error(`Erro ao excluir a sala com ID ${id}.`);
    }
  }
})();