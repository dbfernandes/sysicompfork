import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

class UsuarioService {
  async adicionar (
    nomeCompleto: string,
    cpf: string,
    email: string,
    senha: string,
    administrador: number,
    coordenador: number,
    secretaria: number,
    professor: number,
    endereco: string,
    telResidencial: string,
    telCelular: string,
    siape: string,
    dataIngresso: string,
    unidade: string,
    turno: string
  ) {
    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt)
    // await Usuario.create({
    //   nomeCompleto,
    //   cpf,
    //   email,
    //   senhaHash,
    //   status: 1,
    //   administrador,
    //   coordenador,
    //   secretaria,
    //   professor,
    //   endereco,
    //   telResidencial,
    //   telCelular,
    //   siape,
    //   dataIngresso,
    //   unidade,
    //   turno,
    //   idLattes: null
    // }, {})
    await prisma.usuario.create({
      data: {
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
      }
    })
  }

  async alterar (id: number, user: any) {
    if ('senha' in user && user.senha !== '') {
      const salt = await bcrypt.genSalt(12)
      user.senhaHash = await bcrypt.hash(user.senha, salt)
    }
    // const usuario = await Usuario.findByPk(id)
    // await usuario.update(user)
    await prisma.usuario.update({
      where: {
        id: id
      },
      data: user
    })
  }

  async alterarInfo (id: number, user: any) {
    // let usuario = await Usuario.findByPk(id)
    // usuario = await usuario.update(user)
    await prisma.usuario.update({
      where: {
        id: id
      },
      data: user
    })

    // return usuario
  }

  async listarTodos () {
    // const usuarios = await Usuario.findAll()
    // return usuarios.map(usuario => {
    //   return {
    //     perfis: usuario.perfis(),
    //     ...usuario.get()
    //   }
    // })
    const usuarios = await prisma.usuario.findMany()
    return usuarios;
  }

  async listarUmUsuario (id: number) {
    // const usuario = await Usuario.findByPk(id, {
    //   atributes: ['id', 'nomeCompleto', 'cpf', 'email', 'status', 'siape',
    //     'administrador', 'secretaria', 'professor', 'coordenador',
    //     'dataIngresso', 'endereco', 'telCelular', 'telResidencial', 'unidade',
    //     'turno', 'idLattes', 'createdAt']
    // })
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        nomeCompleto: true,
        cpf: true,
        email: true,
        status: true,
        siape: true,
        administrador: true,
        secretaria: true,
        professor: true,
        coordenador: true,
        dataIngresso: true,
        endereco: true,
        telCelular: true,
        telResidencial: true,
        unidade: true,
        turno: true,
        idLattes: true,
        perfil: true,
        createdAt: true
      }
    })
    const usuarioDict = usuario
    if (!usuarioDict) throw new Error('Usuário não encontrado')
    if (usuarioDict.status === 1) {
      if (usuarioDict.administrador === 1) usuarioDict.perfil += ' Administrador |'
      if (usuarioDict.coordenador === 1) usuarioDict.perfil += ' Coordenador |'
      if (usuarioDict.professor === 1) usuarioDict.perfil += ' Professor |'
      if (usuarioDict.secretaria === 1) usuarioDict.perfil += ' Secretaria |'

      if (usuarioDict.perfil!.endsWith(' |')) {
        usuarioDict.perfil = usuarioDict.perfil!.substring(0, usuarioDict.perfil!.length - 2)
      }
    }
    // usuarioDict.DateFormatada = new Date(usuarioDict.createdAt).toLocaleString('pt-BR', {
    //   timeZone: 'America/Manaus'
    // }).slice(0, 10)
    let usuarioComDataFormatada = {
      ...usuarioDict,
      DateFormatada: new Date(usuarioDict.createdAt).toLocaleString('pt-BR', {
        timeZone: 'America/Manaus'
      }).slice(0, 10)
    }

    return usuarioComDataFormatada
  }

  async listarTodosPorCondicao (data: any) {
    // const usuarios = await Usuario.findAll(
    //   {
    //     where: data,
    //     order: [
    //       ['nomeCompleto', 'ASC']
    //     ],
    //     atributes: ['id', 'nomeCompleto', 'cpf', 'email', 'status', 'siape',
    //       'administrador', 'secretaria', 'professor', 'coordenador',
    //       'dataIngresso', 'endereco', 'telCelular', 'telResidencial', 'unidade',
    //       'turno', 'idLattes', 'formacao', 'formacaoIngles', 'ultimaAtualizacao', 'createdAt']
    //   }
    // )
    const usuarios = await prisma.usuario.findMany({
      where: data,
      orderBy: {
        nomeCompleto: 'asc'
      },
      select: {
        id: true,
        nomeCompleto: true,
        cpf: true,
        email: true,
        status: true,
        siape: true,
        administrador: true,
        secretaria: true,
        professor: true,
        coordenador: true,
        dataIngresso: true,
        endereco: true,
        telCelular: true,
        telResidencial: true,
        unidade: true,
        turno: true,
        idLattes: true,
        formacao: true,
        formacaoIngles: true,
        ultimaAtualizacao: true,
        createdAt: true
      }
    })

    // return usuarios.map(usuario => {
    //   return {
    //     perfis: usuario.perfis(),
    //     ...usuario.get()
    //   }
    // })
    return usuarios
  }
  
  async buscarUsuarioPor(busca: any){
    try {
      // const usuario = await Usuario.findOne({ where: busca})
      const usuario = await prisma.usuario.findFirst({ where: busca})
      return usuario
    } catch (error) {
      throw error
    }
  }
  
  async recuperarSenha(token: string, data: any, id: number) {
    // user = await Usuario.findByPk(id)
    // Usuario.update({
    //     tokenResetSenha: token,
    //     validadeTokenResetSenha: data
    // }, {
    //     where: { id: user.id }
    // })
    await prisma.usuario.update({
      where: {
        id: id
      },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: data
      }
    })
  }
}

export default new UsuarioService()
