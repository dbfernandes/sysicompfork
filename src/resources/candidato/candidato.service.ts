import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateHashPassword } from '../../utils/utils';
const prisma = new PrismaClient();

class CandidatoService {
  validPassword(candidate, password) {
    return candidate.validPassword(password);
  }

  async list() {
    return await prisma.candidato.findMany();
  }

  async create({ email, password, editalNumber }) {
    const step = 1;

    const passwordHash = await generateHashPassword(password);
    const candidate = await prisma.candidato.create({
      data: {
        email,
        senhaHash: passwordHash,
        idEdital: editalNumber,
        posicaoEdital: step,
      },
    });

    delete candidate.senhaHash;
    await prisma.edital.update({
      where: {
        editalId: editalNumber,
      },
      data: {
        inscricoesIniciadas: {
          increment: 1,
        },
      },
    });
    return candidate;
  }

  async findCandidatoByEmailAndEdital({ email, edital }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email,
        idEdital: edital,
      },
    });

    return candidato;
  }

  async auth({ email, password, editalNumber }) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        email,
        idEdital: editalNumber,
      },
    });

    if (!candidate) {
      return null;
    }
    return (await bcrypt.compare(password, candidate.senhaHash))
      ? candidate
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
        Edital: true,
      },
    });
  }
  async update({ id, data }: { id: number; data: any }) {
    return await prisma.candidato.update({
      where: {
        id,
      },
      data,
    });
  }

  async backEdital({ id }) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        id,
      },
    });
    await prisma.candidato.update({
      where: {
        id,
      },
      data: {
        posicaoEdital: candidate.posicaoEdital - 1,
      },
    });

    return candidate;
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
    const candidate = await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });

    if (!candidate) {
      throw new Error('Token inválido');
    }

    if (candidate.validadeTokenReset < new Date()) {
      throw new Error('Token expirado');
    }

    const passwordHash = await generateHashPassword(password);
    return await prisma.candidato.update({
      where: {
        id: candidate.id,
      },
      data: {
        senhaHash: passwordHash,
        tokenResetSenha: null,
        validadeTokenReset: null,
      },
    });
  }

  async listCanditatesByEdital(editalId: string) {
    const candidates = await prisma.candidato
      .findMany({
        where: {
          idEdital: editalId,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Listar Candidatos: ${err}`);
        throw new Error('Não foi possivel listar o candidato');
      });
    return candidates;
  }
}

export default new CandidatoService();
