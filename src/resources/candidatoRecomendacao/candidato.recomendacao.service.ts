import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';
import {
  CreateRecomendacaoDto,
  RecomendacaoStatus,
  SaveRecomendacaoDto,
} from './candidato.recomendacao.types';
import { sendEmail } from '../email/emailService';

const prisma = new PrismaClient();

class CandidatoRecomendacaoService {
  async create(data: CreateRecomendacaoDto) {
    const token = crypto.randomBytes(20).toString('hex');
    return await prisma.candidatoRecomendacao.create({
      data: { ...data, token },
    });
  }

  async getRecomendacoesByCandidato(candidatoId: number) {
    return await prisma.candidatoRecomendacao.findMany({
      where: {
        candidatoId,
      },
    });
  }

  async getRecomendacaoByToken(token: string) {
    return await prisma.candidatoRecomendacao.findFirst({
      where: {
        token,
      },
      include: {
        Candidato: true,
      },
    });
  }

  async save(data: SaveRecomendacaoDto, token: string) {
    return await prisma.candidatoRecomendacao.updateMany({
      where: {
        token,
      },
      data,
    });
  }

  async finishForm(token: string) {
    const recomendacao = await prisma.candidatoRecomendacao.findFirst({
      where: {
        token,
      },
    });
    await prisma.candidatoRecomendacao.updateMany({
      where: {
        token,
      },
      data: {
        passo: RecomendacaoStatus.PREENCHIDA,
        dataResposta: new Date(),
      },
    });
    await this.sendEmailFinish({ idRecomendacao: recomendacao.id });
  }

  async finish(token: string) {
    return await prisma.candidatoRecomendacao.updateMany({
      where: {
        token,
      },
      data: {
        passo: RecomendacaoStatus.FINALIZADA,
      },
    });
  }

  async createManyByCandidate(
    data: {
      nome: string;
      email: string;
      id?: number;
    }[],
    candidatoId: number,
    editalId: number,
    prazo: Date,
  ) {
    console.log(data);
    // Drop recomendacoes
    const listRecomendacoes = await prisma.candidatoRecomendacao.findMany({
      where: {
        editalId,
      },
    });
    const dropRecomendacoes = listRecomendacoes.filter(
      (recomendacao) => !data.some((r) => r.id === recomendacao.id),
    );
    dropRecomendacoes.length &&
      (await prisma.candidatoRecomendacao.deleteMany({
        where: {
          id: {
            in: dropRecomendacoes.map((r) => r.id),
          },
        },
      }));

    // Update recomendacoes
    const updateRecomendacoes = listRecomendacoes.filter((recomendacao) =>
      data.some((r) => r.id === recomendacao.id),
    );
    updateRecomendacoes.length &&
      (await prisma.candidatoRecomendacao.updateMany({
        where: {
          id: {
            in: updateRecomendacoes.map((r) => r.id),
          },
        },
        data: updateRecomendacoes.map((recomendacao) => ({
          ...recomendacao,
          ...data.find((r) => r.id === recomendacao.id),
        })),
      }));

    // Create new recomendacoes
    const createRecomendacoes = data.filter(
      (recomendacao) => !Boolean(recomendacao.id),
    );
    createRecomendacoes.length &&
      (await prisma.candidatoRecomendacao.createMany({
        data: createRecomendacoes.map((recomendacao) => ({
          ...recomendacao,
          token: crypto.randomBytes(20).toString('hex'),
          prazo,
          editalId,
          candidatoId,
        })),
      }));
  }

  async sendEmailForUsersByCandidate({ id, url }: { id: number; url: string }) {
    const recomendacoes = await this.getRecomendacoesByCandidato(id);
    const candidato = await prisma.candidato.findUnique({
      where: {
        id,
      },
    });

    recomendacoes.forEach((recomendacao) => {
      const urlSend = `${url}?token=${recomendacao.token}`;
      sendEmail({
        to: recomendacao.email, // Change to your recipient

        name: 'Coordenação do PPGI',
        title: `[PPGI/UFAM] Solicitacao de Carta de Recomendacao para ${candidato?.nome}`,
        template: 'cartaRecomendacao',
        data: {
          recomendacao: recomendacao,
          candidato: candidato,
          urlSend,
        },
      }).catch((err) => {
        console.log('Error:', err);
      });
    });
  }

  async sendEmailFinish({ idRecomendacao }: { idRecomendacao: number }) {
    const recomendacao = await prisma.candidatoRecomendacao.findFirst({
      where: {
        id: idRecomendacao,
      },
      include: {
        Candidato: true,
      },
    });

    console.log('Send email to:', recomendacao.email);
    sendEmail({
      to: recomendacao.email, // Change to your recipient
      name: 'Coordenação do PPGI',
      title: `[PPGI/UFAM] Resposta de Carta de Recomendacao para ${recomendacao.Candidato.nome}`,
      template: 'cartaRecomendacaoFinalizada',
      data: {
        recomendacao,
      },
    }).catch((err) => {
      console.log('Error:', err);
    });
  }
}

export default new CandidatoRecomendacaoService();
