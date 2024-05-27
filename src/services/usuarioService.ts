import bcrypt from 'bcrypt'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UsuarioService {
  async adicionar(
    nomeCompleto: string, 
    cpf: string,
    email: string,
    senha: string,
    administrador: boolean,
    coordenador: boolean,
    secretaria: boolean,
    professor: boolean,
    endereco: string,
    telResidencial: string,
    telCelular: string,
    siape: string,
    dataIngresso: Date,
    unidade: string,
    turno: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);
  
    // Convertendo dataIngresso para string
    const dataIngressoString = dataIngresso.toISOString();
  
    await prisma.usuario.create({
      data: {
        nomeCompleto,
        cpf,
        email,
        senhaHash,
        status: 1,
        administrador: administrador ? 1 : 0,
        coordenador: coordenador ? 1 : 0,
        secretaria: secretaria ? 1 : 0,
        professor: professor ? 1 : 0,
        endereco,
        telResidencial,
        telCelular,
        siape,
        dataIngresso: dataIngressoString, // Utiliza a data convertida para string
        unidade,
        turno,
        idLattes: null,
        createdAt,
        updatedAt
      },
    });
  }


  async alterar(id: number, user: any) {
    if ('senha' in user && user.senha !== '') {
      const salt = await bcrypt.genSalt(12);
      user.senhaHash = await bcrypt.hash(user.senha, salt);
    }
    await prisma.usuario.update({
      where: { id },
      data: user,
    });
  }

  async alterarInfo(id: number, user: any) {
    let usuario = await prisma.usuario.findUnique({
      where: { id },
    });
    usuario = await prisma.usuario.update({
      where: { id },
      data: user,
    });

    return usuario;
  }

  async listarTodos() {
    const usuarios = await prisma.usuario.findMany();
    return usuarios.map((usuario: any) => {
      return {
        perfis: usuario,
        ...usuario,
        createdAt: usuario.createdAt?.toLocaleString('pt-BR', {
          timeZone: 'America/Manaus',
        }).slice(0, 10),
      };
    });
  }

  async listarUm(id: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
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
        createdAt: true,
      },
    });

    if (!usuario) return null;

    return {
      ...usuario,
      perfis: usuario,
      createdAt: usuario.createdAt?.toLocaleString('pt-BR', {
        timeZone: 'America/Manaus',
      }).slice(0, 10),
    };
  }

  async listarTodosPorCondicao(data: any) {
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
        idLattes: true,
        formacao: true,
        formacaoIngles: true,
        ultimaAtualizacao: true,
        createdAt: true,
      },
    });

    return usuarios.map((usuario: any) => {
      return {
        perfis: usuario,
        ...usuario,
        createdAt: usuario.createdAt?.toLocaleString('pt-BR', {
          timeZone: 'America/Manaus',
        }).slice(0, 10),
      };
    });
  }

  async buscarUsuarioPor(busca: any) {
    const usuario = await prisma.usuario.findFirst({ where: busca });
    return usuario;
  }

  async recuperarSenha(token: string, data: Date, id: number) {
    const user = await prisma.usuario.findUnique({ where: { id } });
    if (!user) return null;
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: data,
      },
    });
  }
}

export default new UsuarioService();
