import crypto from 'crypto';
import prisma from '../../client';
import bcrypt from 'bcrypt';
import { Usuario } from '@prisma/client';
import { generateHashPassword } from '@utils/utils';
import { CreateUsuarioDto, UpdateUsuarioWithPassword } from './usuario.types';
import { sendEmail } from '../email/email.service';
import { UsuarioNotFoundError } from './usuario.errors';

class UsuarioService {
  async verificaCpf(cpf: string): Promise<boolean> {
    const usuario = await prisma.usuario.findUnique({
      where: { cpf },
    });
    return !!usuario;
  }

  async adicionar(usuario: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(usuario.senhaHash, salt);
    const cpfExiste = await this.verificaCpf(usuario.cpf);

    try {
      if (cpfExiste) throw new Error('Este CPF já está cadastrado.');

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

  async getDiretor(): Promise<Usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        diretor: 1,
      },
    });
  }
  async getCoordenador(): Promise<Usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        coordenador: 1,
      },
    });
  }

  async alterar(id: number, user: UpdateUsuarioWithPassword): Promise<void> {
    if ('senha' in user && Boolean(user.senha)) {
      user.senhaHash = await generateHashPassword(user.senha);
      delete user.senha;
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
      if (usuario.secretaria === 1) usuario.perfil += ' Secretaria |';
      if (usuario.diretor === 1) usuario.perfil += ' Secretaria |';
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
    // Busca o usuário pelo e-mail, com case-insensitive
    const usuario = await prisma.usuario.findFirst({
      where: {
        email: data.email.toLowerCase(),
      },
    });

    if (!usuario) {
      throw new UsuarioNotFoundError(data.email);
    }

    // Gera token e calcula tempo de expiração
    const token = crypto.randomBytes(20).toString('hex');

    const DEFAULT_EXPIRE_MS = 3600000; // 1 hora
    const envTime = Number(process.env.TIME_MILLIS_EXPIRE_EMAIL);

    const timeMillis = isNaN(envTime) ? DEFAULT_EXPIRE_MS : envTime;
    const validade = new Date(Date.now() + timeMillis);

    // Atualiza o usuário com o token e a validade
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: validade,
      },
    });

    // Monta URL de alteração de senha
    const protocol =
      data.host.includes('localhost') || data.host.includes('127.0.0.1')
        ? 'http'
        : 'https';
    const url = `${protocol}://${data.host}/alterarSenha?token=${token}`;

    // Envia e-mail
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
