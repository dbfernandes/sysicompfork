import crypto from 'crypto';
import { Prisma, PrismaClient, Usuario } from '@prisma/client';

import bcrypt from 'bcrypt';

import { generateHashPassword } from '../../utils/utils';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioWithPassword,
  UsuarioWithDate,
} from './usuario.types';
const prisma = new PrismaClient();

class UsuarioService {
  async adicionar(usuario: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(usuario.senhaHash, salt);
    return await prisma.usuario.create({ data: { ...usuario, senhaHash } });
  }

  async alterar(id: number, user: UpdateUsuarioWithPassword): Promise<void> {
    if ('senha' in user && user.senha !== '') {
      user.senhaHash = await generateHashPassword(user.senha);
    }
    await prisma.usuario.update({
      where: { id },
      data: user,
    });
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
    await prisma.usuario.update({
      where: { id },
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
