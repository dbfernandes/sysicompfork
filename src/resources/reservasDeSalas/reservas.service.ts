import prisma from '../../client';
import { Prisma, ReservaSala } from '@prisma/client';

export default new (class ReservaService {
  async listarTodos(): Promise<ReservaSala[]> {
    return prisma.reservaSala.findMany();
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

  async criar(
    dados: Prisma.ReservaSalaUncheckedCreateInput,
  ): Promise<ReservaSala> {
    const dataInicio =
      dados.dataInicio instanceof Date
        ? dados.dataInicio
        : new Date(dados.dataInicio as string);

    const dataFim =
      dados.dataFim instanceof Date
        ? dados.dataFim
        : new Date((dados.dataFim as string) || (dados.dataInicio as string));

    return await prisma.reservaSala.create({
      data: {
        ...dados,
        dataInicio,
        dataFim,
        salaId: Number(dados.salaId),
        usuarioId: Number(dados.usuarioId),
      },
    });
  }

  async atualizar(
    id: number,
    data: Prisma.ReservaSalaUncheckedUpdateInput,
  ): Promise<ReservaSala> {
    return await prisma.reservaSala.update({
      where: { id },
      data,
    });
  }

  async remover(id: number): Promise<ReservaSala> {
    return await prisma.reservaSala.delete({ where: { id } });
  }
})();
