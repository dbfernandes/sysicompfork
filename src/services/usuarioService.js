import bcrypt from 'bcrypt'
const { Usuario } = require('../models')

class UsuarioService {
  async adicionar (
    nomeCompleto,
    cpf,
    email,
    senha,
    administrador,
    coordenador,
    secretaria,
    professor,
    endereco,
    telResidencial,
    telCelular,
    siape,
    dataIngresso,
    unidade,
    turno
  ) {
    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt)
    await Usuario.create({
      nomeCompleto,
      cpf,
      email,
      senhaHash,
      status: 1,
      administrador,
      coordenador,
      secretaria,
      professor,
      endereco,
      telResidencial,
      telCelular,
      siape,
      dataIngresso,
      unidade,
      turno,
      idLattes: null
    }, {})
  }

  async alterar (id, user) {
    if ('senha' in user && user.senha !== '') {
      const salt = await bcrypt.genSalt(12)
      user.senhaHash = await bcrypt.hash(user.senha, salt)
    }
    const usuario = await Usuario.findByPk(id)
    await usuario.update(user)
  }

  async alterarInfo (id, user) {
    let usuario = await Usuario.findByPk(id)
    usuario = await usuario.update(user)

    return usuario
  }

  async listarTodos () {
    const usuarios = await Usuario.findAll()
    return usuarios.map(usuario => {
      return {
        perfis: usuario.perfis(),
        ...usuario.get()
      }
    })
  }

  async listarUm (id) {
    const usuario = await Usuario.findByPk(id, {
      atributes: ['id', 'nomeCompleto', 'cpf', 'email', 'status', 'siape',
        'administrador', 'secretaria', 'professor', 'coordenador',
        'dataIngresso', 'endereco', 'telCelular', 'telResidencial', 'unidade',
        'turno', 'idLattes', 'createdAt']
    })
    const usuarioDict = usuario.get()
    usuarioDict.perfil = usuario.perfis()
    usuarioDict.createdAt = new Date(usuarioDict.createdAt).toLocaleString('pt-BR', {
      timeZone: 'America/Manaus'
    }).slice(0, 10)

    return usuarioDict
  }

  async listarTodosPorCondicao (data) {
    const usuarios = await Usuario.findAll(
      {
        where: data,
        order: [
          ['nomeCompleto', 'ASC']
        ],
        atributes: ['id', 'nomeCompleto', 'cpf', 'email', 'status', 'siape',
          'administrador', 'secretaria', 'professor', 'coordenador',
          'dataIngresso', 'endereco', 'telCelular', 'telResidencial', 'unidade',
          'turno', 'idLattes', 'formacao', 'formacaoIngles', 'ultimaAtualizacao', 'createdAt']
      }
    )

    return usuarios.map(usuario => {
      return {
        perfis: usuario.perfis(),
        ...usuario.get()
      }
    })
  }
  
  async buscarUsuarioPor(busca){
    try {
      const usuario = await Usuario.findOne({ where: busca})
      return usuario
    } catch (error) {
      throw error
    }
  }
  
  async recuperarSenha(token, data, id) {
    user = await Usuario.findByPk(id)
    Usuario.update({
        tokenResetSenha: token,
        validadeTokenResetSenha: data
    }, {
        where: { id: user.id }
    })
  }
}

export default new UsuarioService()
