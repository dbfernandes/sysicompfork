import { PrismaClient, ReservaSala } from '@prisma/client';

const prisma = new PrismaClient();

export default new (class ReservaService {
  async listarTodos(): Promise<ReservaSala[]> {
    return await prisma.reservaSala.findMany();
  }

  async listarReservasSalas(): Promise<ReservaSala[]> {
    return await prisma.reservaSala.findMany({
      include: {
        sala: true,
        usuario: {
          select: { id: true, nomeCompleto: true },
        },
      },
    });
  }

  async listarReservasDeUmUsuario(id: number): Promise<ReservaSala[]> {
    return await prisma.reservaSala.findMany({
      where: { usuarioId: id },
      include: {
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
          },
        },
      },
    });
  }

  async buscarReserva(id: number): Promise<ReservaSala | null> {
    return await prisma.reservaSala.findUnique({ where: { id } });
  }

  async criar(reserva: any): Promise<ReservaSala> {
    return await prisma.reservaSala.create({
      data: reserva,
    });
  }

  async atualizar(id: number, reserva: any): Promise<ReservaSala> {
    return await prisma.reservaSala.update({ where: { id }, data: reserva });
  }

  async remover(id: number): Promise<ReservaSala> {
    return await prisma.reservaSala.delete({ where: { id } });
  }
})();
