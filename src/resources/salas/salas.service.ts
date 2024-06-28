import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default new (class SalaService {
  // Pegar todas as Salas
  async listarTodos() {
    // const salas = await Salas.findAll()
    try {
      const salas = await prisma.salas.findMany();
      return salas;
    } catch (error) {
      throw error;
    }
  }

  // Pegar uma sala
  async listarUm(id: number) {
    // const sala = await Salas.findByPk(id)
    const sala = await prisma.salas.findUnique({
      where: {
        id: id,
      },
    });
    return sala;
  }

  // Criar salas
  async criar(
    nome: string,
    bloco: string,
    andar: string,
    numero: number,
    capacidade: number,
  ) {
    try {
      // const salaCriada = await Salas.create(sala)
      await prisma.salas.create({
        data: {
          nome: nome,
          bloco: bloco,
          andar: andar,
          numero: numero,
          capacidade: capacidade,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Editar salas
  async editar(id: number, sala: any) {
    // const salaEditada = await Salas.update(sala, { where: { id } })
    // return salaEditada
    try {
      await prisma.salas.update({
        where: {
          id: id,
        },
        data: {
          nome: sala.nome,
          bloco: sala.bloco,
          andar: sala.andar,
          numero: sala.numero,
          capacidade: sala.capacidade,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Excluir salas
  async excluir(id: number) {
    try {
      // const salaExcluida = await Salas.destroy({ where: { id } })
      await prisma.salas.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
})();
