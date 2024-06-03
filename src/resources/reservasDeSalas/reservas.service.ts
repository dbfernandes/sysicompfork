import { PrismaClient, ReservaSalas, Salas, Usuario } from '@prisma/client'
import { CreateReservaDto } from './reservas.types'

const prisma = new PrismaClient()

export default new class ReservaService {
  async listarTodos(): Promise<ReservaSalas[]> {
    return await prisma.reservaSalas.findMany()
  }

  async listarReservasSalas(): Promise<ReservaSalas[]> {
    return await prisma.reservaSalas.findMany({ include: { 
      Salas: true, 
      Usuario: { 
        select: {id: true, nomeCompleto: true}
      } 
    }})
  }

    async listarReservasDeUmUsuario(id: number): Promise<ReservaSalas[]> {
      return await prisma.reservaSalas.findMany({ 
        where: { UsuarioId: id },
        include: {
          Salas: true,
          Usuario: {
            select: {
              id: true,
              nomeCompleto: true
            }
          }
        }
      })
    }

    async buscarReserva(id: number): Promise<ReservaSalas | null> {
      return await prisma.reservaSalas.findUnique({ where: { id } })
    }

  async criar (reserva: CreateReservaDto): Promise<ReservaSalas> {
    return await prisma.reservaSalas.create({
      data: reserva
    })
  }

  async atualizar (id: number, reserva: CreateReservaDto): Promise<ReservaSalas> {
    return await prisma.reservaSalas.update({ where: {id}, data: reserva})
  }

  async remover (id: number): Promise<ReservaSalas> {
    return await prisma.reservaSalas.delete({ where: {id} })
  }
}()
