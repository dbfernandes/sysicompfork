import prisma from '../../client';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateHashPassword } from '../../utils/utils';
import { Candidato } from '@prisma/client';

class CandidatoServicePublicacao {
  validPassword(candidato, password) {
    return candidato.validPassword(password);
  }

  async list() {
    return await prisma.candidato.findMany();
  }

  async create({ email, senha, edital }) {
    const step = 1;

    const passwordHash = await generateHashPassword(senha);
    const candidato = await prisma.candidato.create({
      data: {
        email,
        senhaHash: passwordHash,
        editalId: edital,
        posicaoEdital: step,
      },
    });

    if (candidato && candidato.senhaHash) {
      delete candidato.senhaHash;
    }
    await prisma.edital.update({
      where: {
        id: edital,
      },
      data: {
        inscricoesIniciadas: {
          increment: 1,
        },
      },
    });
    return candidato;
  }

  async findCandidatoByEmailAndEdital({ email, edital }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email,
        editalId: edital,
      },
    });

    return candidato;
  }

  async auth({ email, senha, editalId }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email,
        editalId: editalId,
      },
    });

    if (!candidato) {
      return null;
    }
    return (await bcrypt.compare(senha, candidato.senhaHash))
      ? candidato
      : null;
  }

  async findById(id: number) {
    return await prisma.candidato.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIdWithEdital(id: number) {
    return await prisma.candidato.findFirst({
      where: {
        id,
      },
      include: {
        edital: true,
      },
    });
  }
  async update({ id, data }: { id: number; data: Partial<Candidato> }) {
    return await prisma.candidato.update({
      where: {
        id,
      },
      data,
    });
  }

  async backEdital({ id }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        id,
      },
    });
    await prisma.candidato.update({
      where: {
        id,
      },
      data: {
        posicaoEdital: candidato.posicaoEdital - 1,
      },
    });

    return candidato;
  }

  async updateTokenPassword({ id }) {
    const token = crypto.randomBytes(20).toString('hex');
    const timeAdd = process.env.TIME_MILLIS_EXPIRE_EMAIL || 3600000;
    const timeExpires = new Date();
    timeExpires.setTime(timeExpires.getTime() + Number(timeAdd));
    await prisma.candidato.update({
      where: {
        id,
      },
      data: {
        tokenResetSenha: token,
        validadeTokenReset: timeExpires,
      },
    });
    return token;
  }

  async findByTokenPassword(token) {
    return await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });
  }

  async changePasswordWithToken({ token, password }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });

    if (!candidato) {
      throw new Error('Token inválido');
    }

    if (candidato.validadeTokenReset < new Date()) {
      throw new Error('Token expirado');
    }

    const passwordHash = await generateHashPassword(password);
    return await prisma.candidato.update({
      where: {
        id: candidato.id,
      },
      data: {
        senhaHash: passwordHash,
        tokenResetSenha: null,
        validadeTokenReset: null,
      },
    });
  }

  async listCanditatesByEdital(editalId: string) {
    const candidatos = await prisma.candidato
      .findMany({
        where: {
          editalId: editalId,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Listar Candidatos: ${err}`);
        throw new Error('Não foi possivel listar o candidato');
      });
    return candidatos;
  }

  async listAllInfocandidato(id: number) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        id,
      },
      include: {
        experienciasAcademicas: true,
        publicacoes: true,
        linhaPesquisa: true,
        recomendacoes: true,
        edital: true,
      },
    });

    return candidato;
  }
}

export default new CandidatoServicePublicacao();
