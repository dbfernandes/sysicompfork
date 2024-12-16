import { Usuario } from '@prisma/client';
import crypto from 'crypto';

import bcrypt from 'bcrypt';

import { generateHashPassword } from '../../utils/utils';
import { sendEmail } from '../email/emailService';
import { UsuarioNotFoundError } from './usuario.errors';
import prisma from '../../client';

class UsuarioService {
  async adicionar(usuario: any): Promise<Usuario> {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(usuario.senhaHash, salt);

    if (usuario.diretor === 1) {
      const usuarioDiretor = await prisma.usuario.findFirst({
        where: {
          diretor: 1,
        },
      });

      if (usuarioDiretor && usuarioDiretor.id !== usuario.id) {
        await prisma.usuario.update({
          where: {
            id: usuarioDiretor.id,
          },
          data: {
            diretor: 0,
          },
        });
      }
    }

    return await prisma.usuario.create({ data: { ...usuario, senhaHash } });
  }

  async alterar(id: number, user: any) {
    if ('senha' in user && user.senha !== '') {
      user.senhaHash = await generateHashPassword(user.senha);
    }

    if (user.diretor === 1) {
      const usuarioAtual = await prisma.usuario.findFirst({
        where: {
          diretor: 1,
        },
      });

      if (usuarioAtual && usuarioAtual.id !== id) {
        await prisma.usuario.update({
          where: {
            id: usuarioAtual.id,
          },
          data: {
            diretor: 0,
          },
        });
      }
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
        diretor: true,
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
        diretor: true,
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

  async recuperarSenha(data: { email: string; host: string }) {
    const usuario = await prisma.usuario.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!usuario) {
      throw new UsuarioNotFoundError(data.email);
    }
    const token = crypto.randomBytes(20).toString('hex');
    const timeAdd = process.env.TIME_MILLIS_EXPIRE_EMAIL || 3600000;
    const timeExpires = new Date();
    timeExpires.setTime(timeExpires.getTime() + Number(timeAdd));

    await prisma.usuario.update({
      where: {
        id: usuario.id,
      },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: timeExpires,
      },
    });

    const url = `http://${data.host}/alterarSenha?token=${token}`;
    sendEmail({
      title: '[Syscomp] Troca de senha',
      to: usuario.email,
      template: 'recuperarSenha',
      data: {
        url,
        nome: usuario.nomeCompleto,
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
