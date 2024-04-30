const { Salas } = require('../models')

export default new class SalaService {
  // Pegar todas as Salas
  async listarTodos () {
    const salas = await Salas.findAll()
    return salas
  }

  // Pegar uma sala
  async listarUm (id) {
    const sala = await Salas.findByPk(id)
    return sala
  }

  // Criar salas
  async criar (nome, bloco, andar, numero, capacidade) {
    // const { nome, bloco, andar, numero, capacidade } = newSala;
    await Salas.create({
      nome,
      bloco,
      andar,
      numero,
      capacidade
    }, {})
  }

  // Editar salas
  async editar (id, sala) {
    const salaEditada = await Salas.update(sala, { where: { id } })
    return salaEditada
  }

  // Excluir salas
  async excluir (id) {
    const salaExcluida = await Salas.destroy({ where: { id } })
    return salaExcluida
  }
}()
