const { ReservaSala } = require('../models')
const { Salas } = require('../models')
const { Usuario } = require('../models')

export default new class ReservaService {
  async listarTodos () {
    const reservas = await ReservaSala.findAll()
    return reservas
  }

  async listarReservasSalas () {
    const reservas = await ReservaSala.findAll({
      include: [
        {
          model: Salas,
          as: 'salas'
        }, {
          model: Usuario,
          as: 'usuario'
        }
      ]
    })
    return reservas
  }

  async listarReservasSalasPorUsuario (id) {
    const reserva = await ReservaSala.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Salas, // Include the associated "Post" model
          as: 'salas' // Alias for the posts association (if defined in the User model)   
        }
      ]
    })
    return reserva
  }

  async listarUm (id) {
    const reserva = await ReservaSala.findByPk(id)
    return reserva
  }

  async criar (reserva) {
    const reservaCriada = await ReservaSala.create(reserva)
    return reservaCriada
  }

  async atualizar (id, reserva) {
    const reservaAtualizada = await ReservaSala.update(reserva, { where: { id } })
    return reservaAtualizada
  }

  async remover (id) {
    const reservaExcluida = await ReservaSala.destroy({ where: { id } })
    return reservaExcluida
  }
}()
