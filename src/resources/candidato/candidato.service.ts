import { Candidato, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateHashPassword } from '../../utils/utils';
import {
  MudarSenhaDto,
  RecuperarSenhaDto,
  SignInDto,
  SignUpDto,
} from '../candidato/candidato.types';
import { sendEmail } from '../email/emailService';
import { CandidatoFinalizadoError } from './errors/candidatoFinalizadoError';
import { CandidatoJaExisteError } from './errors/candidatoJaExisteError';
import { CandidatoNaoAutorizadoError } from './errors/candidatoNaoAutorizadoError';
import { CandidatoNaoExisteError } from './errors/candidatoNaoExiteError';
import { TokenExpiradoError } from './errors/tokenExpiradoError';
import { TokenInvalidoError } from './errors/tokenInvalidoError.';
const prisma = new PrismaClient();

class CandidatoService {
  async list() {
    return await prisma.candidato.findMany();
  }

  async findById(id: number) {
    return await prisma.candidato.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIdComEdital(id: number) {
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

  async listarCandidatosPorEdital(id: string) {
    const edital = await prisma.edital.findFirst({
      where: {
        id,
      },
      include: {
        candidatos: true,
      },
    });
    return edital.candidatos;
  }

  async validarTokenTrocarSenha(token: string): Promise<boolean> {
    const candidato = await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });
    return (
      Boolean(candidato) && new Date(candidato.validadeTokenReset) > new Date()
    );
  }

  async listarTodasInformacoesDeCandidato(id: number) {
    return await prisma.candidato.findFirst({
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
  }

  async signUp({ email, senha, editalId }: SignUpDto): Promise<Candidato> {
    const candidato = await prisma.$transaction(async (prisma) => {
      const candidatoVerify = await prisma.candidato.findFirst({
        where: { email, editalId },
      });

      if (candidatoVerify) {
        throw new CandidatoJaExisteError();
      }

      const senhaHash = await generateHashPassword(senha);
      const novoCandidato = await prisma.candidato.create({
        data: {
          email,
          senhaHash,
          editalId,
          posicaoEdital: 1,
        },
      });

      // Atualizar o edital
      await prisma.edital.update({
        where: { id: editalId },
        data: {
          inscricoesIniciadas: {
            increment: 1,
          },
        },
      });

      // Remover o hash da senha antes de retornar
      delete novoCandidato.senhaHash;

      return novoCandidato;
    });

    return candidato;
  }

  async signIn({ email, senha, editalId }: SignInDto): Promise<Candidato> {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email,
        editalId,
      },
    });

    if (!candidato) {
      throw new CandidatoNaoAutorizadoError();
    }

    if (!(await bcrypt.compare(senha, candidato.senhaHash))) {
      throw new CandidatoNaoAutorizadoError();
    }

    if (candidato.posicaoEdital > 4) {
      throw new CandidatoFinalizadoError();
    }

    delete candidato.senhaHash;
    return candidato;
  }

  async atualizarPassoDados() {
    // const isBrasileira = data.nacionalidade === Nacionalidade.BRASILEIRA;

    // const dataNascimento = data.dataNascimento
    //   ? new Date(parseDate(data.dataNascimento))
    //   : null;
    // const candidato = {
    //   ...data,
    //   dataNascimento,
    //   posicaoEdital: 2,
    //   condicao: data.condicao === 'true',
    //   bolsista: data.bolsista === 'true',
    //   cotista: data.cotista === 'true',
    //   cpf: isBrasileira ? data.cpf : null,
    //   passaporte: isBrasileira ? null : data.passaporte,
    //   pais: isBrasileira ? null : data.pais,
    // };

    // await candidatoService.update({
    //   id,
    //   data: candidato,
    // });
    return true;
  }

  async findCandidatoByEmailAndEdital({
    email,
    editalId,
  }: {
    email: string;
    editalId: string;
  }): Promise<Candidato> {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email,
        editalId,
      },
    });

    if (!candidato) {
      throw new CandidatoNaoExisteError();
    }

    return candidato;
  }

  async recuperarSenha({
    host,
    ...data
  }: RecuperarSenhaDto & { host: string }): Promise<void> {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email: data.email,
        editalId: data.editalId,
      },
    });

    if (!candidato) {
      throw new CandidatoNaoExisteError();
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

  async mudarSenhaComToken({ token, senha }: MudarSenhaDto): Promise<void> {
    const candidate = await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });

    if (!candidate) {
      throw new TokenInvalidoError();
    }

    if (new Date(candidate.validadeTokenReset) < new Date()) {
      throw new TokenExpiradoError();
    }

    const senhaHash = await generateHashPassword(senha);
    await prisma.candidato.update({
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

  async voltarInicioEdital({ id }: { id: number }): Promise<void> {
    await prisma.candidato.update({
      where: {
        id,
      },
      data: {
        posicaoEdital: 1,
      },
    });
  }

  async voltarPassoEdital({ id }: { id: number }): Promise<number> {
    const candidato = await prisma.candidato.update({
      where: {
        id,
        posicaoEdital: { gt: 1 },
      },
      data: {
        posicaoEdital: { decrement: 1 },
      },
    });

    if (!candidato) {
      throw new CandidatoNaoExisteError();
    }

    return candidato.posicaoEdital;
  }
}

export default new CandidatoService();
