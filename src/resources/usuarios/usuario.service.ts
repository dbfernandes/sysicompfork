import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

import { generateHashPassword } from "../../utils/utils";
const prisma = new PrismaClient();


class UsuarioService {
  async adicionar( 
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
    turno: string,
  ) {
    const senhaHash = await generateHashPassword(senha);

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
        dataIngresso,
        unidade,
        turno,
        idLattes: null,
      },
    });
  }

  async alterar(id: number, user: any) {
    if ("senha" in user && user.senha !== "") {
      user.senhaHash = await generateHashPassword(user.senha);
    }
    await prisma.usuario.update({
      where: {
        id: id,
      },
      data: user,
    });
  }

  async alterarInfo(id: number, user: any) {
    await prisma.usuario.update({
      where: {
        id: id,
      },
      data: user,
    });
  }

  async listarTodos() {
    const usuarios = await prisma.usuario.findMany();
    return usuarios;
  }

  async listarUmUsuario(id: number) {
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
        idLattes: true,
        perfil: true,
        createdAt: true,
      },
    });
    const usuarioDict = usuario;
    if (!usuarioDict) throw new Error("Usuário não encontrado");
    if (usuarioDict.status === 1) {
      if (usuarioDict.administrador === 1)
        usuarioDict.perfil += " Administrador |";
      if (usuarioDict.coordenador === 1) usuarioDict.perfil += " Coordenador |";
      if (usuarioDict.professor === 1) usuarioDict.perfil += " Professor |";
      if (usuarioDict.secretaria === 1) usuarioDict.perfil += " Secretaria |";

      if (usuarioDict.perfil!.endsWith(" |")) {
        usuarioDict.perfil = usuarioDict.perfil!.substring(
          0,
          usuarioDict.perfil!.length - 2
        );
      }
    }

    let usuarioComDataFormatada = {
      ...usuarioDict,
      DateFormatada: new Date(usuarioDict.createdAt)
        .toLocaleString("pt-BR", {
          timeZone: "America/Manaus",
        })
        .slice(0, 10),
    };

    return usuarioComDataFormatada;
  }

  async listarTodosPorCondicao(data: any) {
    const usuarios = await prisma.usuario.findMany({
      where: data,
      orderBy: {
        nomeCompleto: "asc",
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

    return usuarios;
  }

  async buscarUsuarioPor(busca: any) {
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
        id: id,
      },
      data: {
        tokenResetSenha: token,
        validadeTokenResetSenha: data,
      },
    });
  }

  async atualizarTokenSenha(id: number) {
    const token = crypto.randomBytes(20).toString("hex");
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

  async mudarSenhaComToken({
    token,
    password,
  }) {
    const usuario = await prisma.usuario.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });
    if (!usuario) {
      throw new Error("Token inválido");
    }
    if (usuario.validadeTokenResetSenha < new Date()) {
      throw new Error("Token expirado");
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
