import { PrismaClient, Sala } from '@prisma/client';

const prisma = new PrismaClient();

export default new (class SalaService {
  // Pegar todas as Salas
  async listarTodos(): Promise<Sala[]> {
    return await prisma.sala.findMany();
  }

  // Pegar uma sala
  async listarUmaSala(id: number): Promise<Sala | null> {
    return await prisma.sala.findUnique({ where: { id } });
  }

  // Criar salas
  async criar(sala: any): Promise<Sala> {
    return await prisma.sala.create({ data: sala });
  }

  // Editar salas
  async editar(id: number, sala: any): Promise<Sala> {
    return await prisma.sala.update({ where: { id }, data: sala });
  }

  // Excluir salas
  async excluir(id: number): Promise<Sala> {
    return await prisma.sala.delete({ where: { id } });
  }
})();
