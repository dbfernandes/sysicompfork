import prisma from '../../client';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { Candidato } from '@prisma/client';

import { generateHashPassword } from '../../utils/utils';
import {
  MudarSenhaDto,
  RecuperarSenhaDto,
  SignInDto,
  SignUpDto,
} from '../candidato/candidato.types';
import { sendEmail } from '../email/email.service';
import { CandidatoFinalizadoError } from './errors/candidatoFinalizadoError';
import { CandidatoJaExisteError } from './errors/candidatoJaExisteError';
import { CandidatoNaoAutorizadoError } from './errors/candidatoNaoAutorizadoError';
import { CandidatoNaoExisteError } from './errors/candidatoNaoExiteError';
import { TokenExpiradoError } from './errors/tokenExpiradoError';
import { TokenInvalidoError } from './errors/tokenInvalidoError.';

class CandidatoService {
  async list() {
    return prisma.candidato.findMany();
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
    return prisma.candidato.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIdComEdital(id: number) {
    return prisma.candidato.findFirst({
      where: {
        id,
      },
      include: {
        edital: true,
      },
    });
  }

  async update({ id, data }: { id: number; data: Partial<Candidato> }) {
    return prisma.candidato.update({
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
    return prisma.candidato.findFirst({
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

  /**
   * Realiza o processo de registro (sign-up) de um novo candidato.
   *
   * @param {SignUpDto} param0 - Objeto contendo o email, senha e ID do edital.
   * @returns {Promise<Candidato>} Retorna o candidato recém-criado, sem o hash da senha.
   *
   * @throws {CandidatoJaExisteError} - Se já existir um candidato registrado com o mesmo email e ID de edital código 409.
   */
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

  /**
   * Realiza o processo de login de um candidato.
   *
   * @param {SignInDto} param0 - Objeto contendo o email, senha e ID do edital.
   * @returns {Promise<Candidato>} Retorna o candidato autenticado, sem o hash da senha.
   *
   * @throws {CandidatoNaoAutorizadoError} - Se o candidato não for encontrado ou se a senha for inválida código 404.
   * @throws {CandidatoFinalizadoError} - Se o candidato estiver em uma posição finalizada no edital código 409.
   */
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
    const timeAdd = Number(process.env.TIME_MILLIS_EXPIRE_EMAIL) || 3600000;
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

    const url = `http://${host}/trocarSenha?token=${token}`;
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

  async enviarEmailConfirmacao({ id }: { id: number }): Promise<void> {
    const candidate = await prisma.candidato.findFirst({
      where: {
        id,
      },
    });
    const pathCandidate = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'candidato',
      `${candidate.id}`,
    );

    fs.stat(pathCandidate, async (err, stats) => {
      if (err || !stats.isDirectory()) {
        return;
      }
      fs.readdir(pathCandidate, async (err, files) => {
        if (err) {
          return;
        }
        const filesToSend = files.filter((file) => file == 'Inscricao.pdf');
        const attachments = filesToSend.map((file) => {
          const filePath = path.join(pathCandidate, file);
          const fileData = fs.readFileSync(filePath);
          const base64 = fileData.toString('base64');
          return {
            content: base64,
            filename: file,
            type: 'application/pdf',
            disposition: 'attachment',
          };
        });
        await sendEmail({
          to: candidate.email,
          name: 'Coordenação do PPGI',
          title: '[PPGI] Inscrição realizada com sucesso !\n',
          template: 'inscricaoFinalizada',
          attachments,
          data: {
            nameCandidate: candidate.nome,
          },
        });
      });
    });
  }
}

export default new CandidatoService();
