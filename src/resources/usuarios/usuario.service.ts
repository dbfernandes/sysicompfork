import crypto from 'crypto';
import prisma from '../../client';
import bcrypt from 'bcrypt';
import { Usuario, Prisma } from '@prisma/client';
import { generateHashPassword } from '../../utils/utils';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioWithPassword,
  UsuarioWithDate,
} from './usuario.types';

class UsuarioService {
  async adicionar(usuario: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(usuario.senhaHash, salt);
    try {
      if (usuario.diretor === 1) {
        const usuarioDiretor = await prisma.usuario.findFirst({
          where: {
            diretor: 1,
          },
        });

        if (usuarioDiretor) {
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
    } catch (error) {
      throw new Error('Erro ao adicionar usuário');
    }

  }

  async alterar(id: number, user: UpdateUsuarioWithPassword): Promise<void> {
    try {
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
        where: { id },
        data: user,
      });
    } catch (error) {
      throw new Error('Erro ao alterar usuário');
    }
  }

  async alterarInfo(id: number, user: UpdateUsuarioDto): Promise<void> {
    await prisma.usuario.update({
      where: { id },
      data: user,
    });
  }

  async listarTodos(): Promise<Usuario[]> {
    return await prisma.usuario.findMany();
  }

  async listarUmUsuario(id: number): Promise<UsuarioWithDate> {
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

    if (!usuario) throw new Error('Usuário não encontrado');

    if (usuario.status === 1) {
      if (usuario.administrador === 1) usuario.perfil += ' Administrador |';
      if (usuario.coordenador === 1) usuario.perfil += ' Coordenador |';
      if (usuario.professor === 1) usuario.perfil += ' Professor |';
      if (usuario.secretaria === 1) usuario.perfil += ' Secretaria |';
      if (usuario.diretor === 1) usuario.perfil += ' Secretaria |';
      if (usuario.perfil?.endsWith(' |')) {
        usuario.perfil = usuario.perfil.substring(0, usuario.perfil.length - 2);
      }
    }

    return {
      ...usuario,
      DateFormatada: new Date(usuario.createdAt)
        .toLocaleString('pt-BR', {
          timeZone: 'America/Manaus',
        })
        .slice(0, 10),
    };
  }

  async listarTodosPorCondicao(
    data: Prisma.UsuarioWhereInput,
  ): Promise<Partial<Usuario>[]> {
    return await prisma.usuario.findMany({
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
  }

  async buscarUsuarioPor(
    busca: Prisma.UsuarioWhereInput,
  ): Promise<Usuario | null> {
    try {
      return await prisma.usuario.findFirst({ where: busca });
    } catch (error) {
      throw error;
    }
  }

  async recuperarSenha(token: string, data: Date, id: number): Promise<void> {
    try {
      await prisma.usuario.update({
        where: { id },
        data: {
          tokenResetSenha: token,
          validadeTokenResetSenha: data,
        },
      });
    } catch (error) {
      throw new Error('Erro ao recuperar senha');
    }
  }

  async atualizarTokenSenha(id: number) {
    const token = crypto.randomBytes(20).toString('hex');
    const timeAdd = process.env.TIME_MILLIS_EXPIRE_EMAIL || 3600000;
    const timeExpires = new Date();
    timeExpires.setTime(timeExpires.getTime() + Number(timeAdd));
    try {
      await prisma.usuario.update({
        where: {
          id,
        },
        data: {
          tokenResetSenha: token,
          validadeTokenResetSenha: timeExpires,
        },
      });
    } catch (error) {
      throw new Error('Erro ao atualizar token');
    }
  }

  async mudarSenhaComToken({ token, password }) {
    try {
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
    } catch (error) {
      throw new Error('Erro ao atualizar senha');
    }
  }
}

export default new UsuarioService();
