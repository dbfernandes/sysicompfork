import prisma from '@client/prismaClient';
import { Sala } from '@prisma/client';

export default new (class SalaService {
  async listAll() {
    return prisma.sala.findMany();
  }

  async getById(id: number) {
    return prisma.sala.findUnique({
      where: { id },
    });
  }

  async getByIdWithReservas(id: number) {
    return prisma.sala.findUnique({
      where: { id },
      include: { reservas: true },
    });
  }
  // Criar sala
  async criar(sala: any): Promise<Sala> {
    try {
      const linha = await prisma.sala.create({ data: sala });
      return linha;
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      throw new Error('Erro ao criar');
    }
  }

  // Editar sala
  async editar(id: number, sala: any): Promise<Sala> {
    try {
      const linha = await prisma.sala.update({ where: { id }, data: sala });
      return linha;
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      throw new Error('Erro ao editar');
    }
  }

  // Excluir sala
  async excluir(id: number): Promise<void> {
    try {
      await prisma.sala.delete({ where: { id } });
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      throw new Error('Erro ao excluir');
    }
  }
})();
