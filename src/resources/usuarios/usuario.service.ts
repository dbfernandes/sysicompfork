import crypto from 'crypto';
import { PrismaClient, Usuario } from '@prisma/client';

import bcrypt from 'bcrypt';

import { generateHashPassword } from '../../utils/utils';
const prisma = new PrismaClient();

class UsuarioService {
  async adicionar(usuario: any): Promise<Usuario> {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(usuario.senhaHash, salt);

    return await prisma.usuario.create({ data: { ...usuario, senhaHash } });
  }

  async alterar(id: number, user: any) {
    if ('senha' in user && user.senha !== '') {
      user.senhaHash = await generateHashPassword(user.senha);
    }
    await prisma.usuario.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async alterarInfo(id: number, user: any) {
    await prisma.usuario.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async listarTodos(): Promise<Usuario[]> {
    return await prisma.usuario.findMany();
  }

  async listarUmUsuario(id: number): Promise<any> {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(id),
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
        lattesId: true,
        perfil: true,
        createdAt: true,
      },
    });
    const usuarioDict = usuario;
    if (!usuarioDict) throw new Error('Usuário não encontrado');
    if (usuarioDict.status === 1) {
      if (usuarioDict.administrador === 1)
        usuarioDict.perfil += ' Administrador |';
      if (usuarioDict.coordenador === 1) usuarioDict.perfil += ' Coordenador |';
      if (usuarioDict.professor === 1) usuarioDict.perfil += ' Professor |';
      if (usuarioDict.secretaria === 1) usuarioDict.perfil += ' Secretaria |';

      if (usuarioDict.perfil!.endsWith(' |')) {
        usuarioDict.perfil = usuarioDict.perfil!.substring(
          0,
          usuarioDict.perfil!.length - 2,
        );
      }
    }
    // usuarioDict.DateFormatada = new Date(usuarioDict.createdAt).toLocaleString('pt-BR', {
    //   timeZone: 'America/Manaus'
    // }).slice(0, 10)
    const usuarioComDataFormatada = {
      ...usuarioDict,
      DateFormatada: new Date(usuarioDict.createdAt)
        .toLocaleString('pt-BR', {
          timeZone: 'America/Manaus',
        })
        .slice(0, 10),
    };

    return usuarioComDataFormatada;
  }

  async listarTodosPorCondicao(data: any): Promise<any[]> {
    const usuarios = await prisma.usuario.findMany({
      where: data,
      orderBy: {
        nomeCompleto: 'asc',
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
        lattesId: true,
        formacao: true,
        formacaoIngles: true,
        ultimaAtualizacao: true,
        createdAt: true,
      },
    });

    return usuarios;
  }

  async buscarUsuarioPor(busca: any): Promise<Usuario | null> {
    try {
      const usuario = await prisma.usuario.findFirst({ where: busca });
      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async recuperarSenha(token: string, data: any, id: number) {
    await prisma.usuario.update({
      where: {
        id,
      },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: data,
      },
    });
  }

  async atualizarTokenSenha(id: number) {
    const token = crypto.randomBytes(20).toString('hex');
    const timeAdd = process.env.TIME_MILLIS_EXPIRE_EMAIL || 3600000;
    const timeExpires = new Date();
    timeExpires.setTime(timeExpires.getTime() + Number(timeAdd));

    await prisma.usuario.update({
      where: {
        id,
      },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: timeExpires,
      },
    });
    return token;
  }

  async mudarSenhaComToken({ token, password }) {
    const usuario = await prisma.usuario.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });
    if (!usuario) {
      throw new Error('Token inválido');
    }
    if (usuario.validadeTokenResetSenha < new Date()) {
      throw new Error('Token expirado');
    }

    const passwordHash = await generateHashPassword(password);
    return await prisma.usuario.update({
      where: {
        id: usuario.id,
      },
      data: {
        senhaHash: passwordHash,
        tokenResetSenha: null,
        validadeTokenResetSenha: null,
      },
    });
  }
}

export default new UsuarioService();
