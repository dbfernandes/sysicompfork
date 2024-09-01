import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';
import {
  CreateRecomendacaoDto,
  RecomendacaoStatus,
  SaveRecomendacaoDto,
} from './candidato.recomendacao.types';
import sgMail from '../../utils/mailerGrid';

const prisma = new PrismaClient();

class CandidatoRecomendacaoService {
  async create(data: CreateRecomendacaoDto) {
    const token = crypto.randomBytes(20).toString('hex');
    return await prisma.candidatoRecomendacao.create({
      data: { ...data, token },
    });
  }

  async getRecomendacoesByCandidato(idCandidato: number) {
    return await prisma.candidatoRecomendacao.findMany({
      where: {
        idCandidato,
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
    idCandidato: number,
    idEdital: string,
    prazo: Date,
  ) {
    console.log(data);
    // Drop recomendacoes
    const listRecomendacoes = await prisma.candidatoRecomendacao.findMany({
      where: {
        idCandidato,
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
          idEdital,
          idCandidato,
        })),
      }));
  }

  async sendEmailRecoveryPasswordCandidate({
    idCandidato,
    url,
  }: {
    idCandidato: number;
    url: string;
  }) {
    const recomendacoes = await this.getRecomendacoesByCandidato(idCandidato);
    const candidato = await prisma.candidato.findUnique({
      where: {
        id: idCandidato,
      },
    });
    console.log('Send email to:', candidato?.email);
    recomendacoes.forEach((recomendacao) => {
      const urlSend = `${url}?token=${recomendacao.token}`;
      sgMail
        .send({
          to: recomendacao.email, // Change to your recipient
          from: {
            email: process.env.SENDGRID_EMAIL_SEND,
            name: 'Coordenação do PPGI',
          }, // Change to your verified sender
          subject: `[PPGI/UFAM] Solicitacao de Carta de Recomendacao para ${candidato?.nome}`,
          text: 'teste',
          html: `
              <div>
              Caro(a) ${recomendacao.nome},
              <br>
              <br>
              Você foi requisitado(a) por ${candidato?.nome} (email: <a href="mailto:${candidato?.email}">${candidato?.email}</a>) para escrever uma carta de recomendação para o processo de seleção do Programa de Pós-Graduação em Informática (PPGI) da Universidade Federal do Amazonas (UFAM).
              <br>
              <p>
              Para isso, a carta deve ser preenchida eletronicamente utilizando o link:<br>
              <a href="${urlSend}">${urlSend}</a><br>
              O prazo para preenchimento da carta é ${recomendacao.prazo.toLocaleDateString()}.<br>
              Em caso de dúvidas, por favor, entre em contato com <a href="mailto:secretariappgi@icomp.ufam.edu.br">secretariappgi@icomp.ufam.edu.br</a>. Não responda este email.<br>
              Agradecemos sua colaboração.
              </p>
              <p>
              Coordenação do PPGI - ${new Date().toLocaleString()} <br>
              <<<--==-->>>
              </p>
            </div>`,
        })
        .catch((err) => {
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
    sgMail
      .send({
        to: recomendacao.email, // Change to your recipient
        from: {
          email: process.env.SENDGRID_EMAIL_SEND,
          name: 'Coordenação do PPGI',
        }, // Change to your verified sender
        subject: `[PPGI/UFAM] Resposta de Carta de Recomendacao para ${recomendacao.Candidato.nome}`,
        text: 'teste',
        html: `
          <div>
          Caro(a) ${recomendacao.nome},
          <br>
          <br>
          A carta de recomendação enviada para ${recomendacao.Candidato.nome} (email: ${recomendacao.Candidato.email}">${recomendacao.Candidato.email}</a>) foi devidamente respondida.
          <br>
          Em caso de dúvidas, por favor nos contate. Agradecemos sua colaboração.
          <br>
          <p>
          Coordenação do PPGI - ${new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Manaus',
            timeZoneName: 'long',
          })} <br>
          <<<--==-->>>
          </p>
        </div>`,
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }
}

export default new CandidatoRecomendacaoService();
