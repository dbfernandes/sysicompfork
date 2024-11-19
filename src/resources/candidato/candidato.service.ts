import { Candidato, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateHashPassword } from '../../utils/utils';
import {
  ChangePasswordDto,
  RecoverPasswordDto,
  SignInDto,
  SignUpDto,
} from '../candidato/candidato.types';
import { CandidatoNotFoundError } from './candidato.errors';
import { sendEmail } from '../email/emailService';
const prisma = new PrismaClient();

class CandidatoService {
  validPassword(candidate, password) {
    return candidate.validPassword(password);
  }

  async list() {
    return await prisma.candidato.findMany();
  }

  async create({ email, senha, editalId }: SignUpDto) {
    const passwordHash = await generateHashPassword(senha);

    const candidate = await prisma.candidato.create({
      data: {
        email,
        senhaHash: passwordHash,
        editalId,
        posicaoEdital: 1,
      },
    });

    delete candidate.senhaHash;
    await prisma.edital.update({
      where: {
        id: editalId,
      },
      data: {
        inscricoesIniciadas: {
          increment: 1,
        },
      },
    });
    return candidate;
  }

  async findCandidatoByEmailAndEdital({
    email,
    editalId,
  }: {
    email: string;
    editalId: number;
  }) {
    return await prisma.candidato.findFirst({
      where: {
        editalId,
        email,
      },
    });
  }

  async auth({ email, senha, editalId }: SignInDto) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        email,
        editalId,
      },
    });

    if (!candidate) {
      return null;
    }
    return (await bcrypt.compare(senha, candidate.senhaHash))
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

  async update({ id, data }: { id: number; data: Partial<Candidato> }) {
    return await prisma.candidato.update({
      where: {
        id,
      },
      data,
    });
  }

  async backEdital({ id }: { id: number }) {
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

  async recuperarSenha({
    host,
    ...data
  }: RecoverPasswordDto & { host: string }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email: data.email,
        editalId: data.editalId,
      },
    });

    if (!candidato) {
      throw new CandidatoNotFoundError(data.email);
    }

    const token = crypto.randomBytes(20).toString('hex');
    const timeAdd = process.env.TIME_MILLIS_EXPIRE_EMAIL || 3600000;
    const timeExpires = new Date();
    timeExpires.setTime(timeExpires.getTime() + Number(timeAdd));
    await prisma.candidato.update({
      where: {
        id: candidato.id,
      },
      data: {
        tokenResetSenha: token,
        validadeTokenReset: timeExpires,
      },
    });

    const url = `http://${host}/selecaoppgi/trocarSenha?token=${token}`;
    sendEmail({
      to: candidato.email,
      name: 'Coordenação do PPGI',
      title: '[PPGI] Troca de senha',
      template: 'recuperarSenhaCandidato',
      data: {
        url,
      },
    });
  }

  async findByTokenPassword(token: string) {
    return await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });
  }

  async changePasswordWithToken({ token, senha }: ChangePasswordDto) {
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

    const senhaHash = await generateHashPassword(senha);
    return await prisma.candidato.update({
      where: {
        id: candidate.id,
      },
      data: {
        senhaHash,
        tokenResetSenha: null,
        validadeTokenReset: null,
      },
    });
  }

  async listCanditatesByEdital(editalCodigo: string) {
    const edital = await prisma.edital.findFirst({
      where: {
        editalCodigo,
      },
      include: {
        Candidatos: true,
      },
    });
    return edital.Candidatos;
  }

  async listAllInfoCandidate(id: number) {
    return await prisma.candidato.findFirst({
      where: {
        id,
      },
      include: {
        CandidatoExperienciaAcademicas: true,
        CandidatoPublicacoes: true,
        linhaPesquisa: true,
        CandidatoRecomendacoes: true,
        Edital: true,
      },
    });
  }
}

export default new CandidatoService();
