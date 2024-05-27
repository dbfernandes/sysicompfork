import { PrismaClient } from '@prisma/client'
import Salas from '../models/Salas'
import Usuario from '../models/Usuario'
import ReservaSala from '../models/ReservaSala'
const prisma = new PrismaClient()

export default new class ReservaService {
  async listarTodos () {
    // const reservas = await ReservaSala.findAll()
    // return reservas
    try {
      const reservas = await prisma.reservaSalas.findMany()
      return reservas
    } catch (error) {
      throw error
    }
  }

  async listarReservasSalas () {
    // const reservas = await ReservaSala.findAll({
    //   include: [
    //     {
    //       model: Salas,
    //       as: 'salas'
    //     }, {
    //       model: Usuario,
    //       as: 'usuario'
    //     }
    //   ]
    // })
    // return reservas
    try {
      const reservas = await prisma.reservaSalas.findMany({
        include: {
          Salas: true,
          Usuario: true
        }
      })
      return reservas
    } catch (error) {
      throw error
    }
  }

    async listarReservasSalasPorUsuario(id) {
        try {
            const reserva = await prisma.reservaSalas.findUnique({
                where: {
                  id: parseInt(id)
                },
                include: {
                  Salas: true
                }
            })
            return reserva
        } catch (error) {
          console.log(error)
          throw error
        }
    }

    async buscarReserva(id) {
        // try {
        //     const reserva = await ReservaSala.findByPk(id);
        //     return reserva;
        // }
        // catch (error) {
        //     throw error;
        // }
        try {
            const reserva = await prisma.reservaSalas.findUnique({
                where: {
                  id: parseInt(id)
                }
            })
            return reserva
        } catch (error) {
            throw error
        }
    }

  async criar (reserva) {
    // const reservaCriada = await ReservaSala.create(reserva)
    // return reservaCriada
    const {
      UsuarioId,
      atividade,
      tipo,
      SalaId,
      dataInicio,
      dataTermino,
      horaInicio,
      horaTermino,
      dias,
    } = reserva
    console.log(reserva)
    try {
      await prisma.reservaSalas.create({
        data: {
          UsuarioId: parseInt(UsuarioId),
          SalaId: parseInt(SalaId),
          atividade,
          tipo,
          dataInicio: new Date(dataInicio),
          dataTermino: new Date(dataTermino),
          horaInicio,
          horaTermino,
          dias
        }
      })
      // return novaReserva
    } catch (error) {
      throw error
    }
  }

  async atualizar (id, reserva) {
    const {
      idSala,
      idUsuario,
      dataInicio,
      dataFim
    } = reserva

    try {
      const reservaAtualizada = await prisma.reservaSalas.update({
        where: {
          id: parseInt(id)
        },
        data: {
          idSala,
          idUsuario,
          dataInicio,
          dataFim,
          updatedAt: new Date()
        }
      })
      return reservaAtualizada
    } catch (error) {
      throw error
    }
  }

  async remover (id) {
    // const reservaExcluida = await ReservaSala.destroy({ where: { id } })
    // return reservaExcluida
    try {
      const reservaExcluida = await prisma.reservaSalas.delete({
        where: {
          id: id
        }
      })
      return reservaExcluida
    } catch (error) {
      throw error
    }
  }
}()
