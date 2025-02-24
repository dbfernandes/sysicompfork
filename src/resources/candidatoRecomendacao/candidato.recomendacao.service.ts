import crypto from 'crypto';

import {
  CandidatoRecomendacao,
  PrismaClient,
  Recomendacoes,
} from '@prisma/client';
import {
  CreateRecomendacaoDto,
  RecomendacaoStatus,
  SaveRecomendacaoDto,
} from './candidato.recomendacao.types';
import { sendEmail } from '../email/email.service';

const prisma = new PrismaClient();

class CandidatoRecomendacaoService {
  async create(data: CreateRecomendacaoDto) {
    const token = crypto.randomBytes(20).toString('hex');
    return prisma.candidatoRecomendacao.create({
      data: { ...data, token },
    });
  }

  async getAllRecomendationsFromCandidate(candidatoId: number) {
    return prisma.candidatoRecomendacao.findMany({
      where: {
        candidatoId,
      },
      include: {
        candidato: true,
      },
    });
  }

  async getRecomendacoesByCandidato(candidatoId: number) {
    return prisma.candidatoRecomendacao.findMany({
      where: {
        candidatoId,
      },
    });
  }

  async getRecomendacaoByToken(token: string) {
    return prisma.candidatoRecomendacao.findFirst({
      where: {
        token,
      },
      include: {
        candidato: true,
      },
    });
  }

  async save(data: SaveRecomendacaoDto, token: string) {
    return prisma.candidatoRecomendacao.updateMany({
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
    return prisma.candidatoRecomendacao.updateMany({
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
    editalId: string,
    prazo: Date,
  ) {
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
        console.error('Error:', err);
      });
    });
  }

  async sendEmailFinish({ idRecomendacao }: { idRecomendacao: number }) {
    const recomendacao = await prisma.candidatoRecomendacao.findFirst({
      where: {
        id: idRecomendacao,
      },
      include: {
        candidato: true,
      },
    });

    sendEmail({
      to: recomendacao.email, // Change to your recipient
      name: 'Coordenação do PPGI',
      title: `[PPGI/UFAM] Resposta de Carta de Recomendacao para ${recomendacao.candidato.nome}`,
      template: 'cartaRecomendacaoFinalizada',
      data: {
        recomendacao,
      },
    }).catch((err) => {
      console.error('Error:', err);
    });
  }

  getLabelClassificação(classificacao: number) {
    return `Entre os ${classificacao}% mais aptos`;
  }

  getLabelAttribute(value: number) {
    switch (value) {
      case 1:
        return 'Fraco';
      case 2:
        return 'Regular';
      case 3:
        return 'Bom';
      case 4:
        return 'Muito Bom';
      case 5:
        return 'Excelente';
      default:
        return 'Não Informado';
    }
  }

  getLabelKnowFron(recommendation: CandidatoRecomendacao) {
    const places: string[] = [];
    if (recommendation.conheceGraduacao) {
      places.push('Graduação');
    }
    if (recommendation.conhecePos) {
      places.push('Pós-Graduação');
    }
    if (recommendation.conheceEmpresa) {
      places.push('Empresa');
    }
    if (recommendation.conheceOutros && recommendation.outrosLugares) {
      places.push(recommendation.outrosLugares);
    }
    const last = places.pop();

    if (places.length === 0) {
      return last;
    }
    return `${places.join(', ')} e ${last}`;
  }

  getLabelWasYour(recommendation: CandidatoRecomendacao) {
    const profissional = [];
    if (recommendation.orientador) {
      profissional.push('Orientador');
    }
    if (recommendation.professor) {
      profissional.push('Professor');
    }
    if (recommendation.empregador) {
      profissional.push('Empregador');
    }

    if (recommendation.coordenador) {
      profissional.push('Coordenador');
    }
    if (recommendation.colegaCurso) {
      profissional.push(recommendation.colegaCurso);
    }
    if (recommendation.colegaTrabalho) {
      profissional.push(recommendation.colegaTrabalho);
    }
    if (recommendation.outrosContatos && recommendation.outrasFuncoes) {
      profissional.push(recommendation.outrasFuncoes);
    }

    const last = profissional.pop();
    if (profissional.length === 0) {
      return last;
    }
    return `${profissional.join(', ')} e ${last}`;
  }
  async getRecomendationsForPDF(candidatoId: number) {
    const recommendations =
      await this.getAllRecomendationsFromCandidate(candidatoId);
    const recommendationsFinish = recommendations.filter((recomendation) =>
      Boolean(recomendation.dataResposta),
    );
    const recommendationsFormated = recommendationsFinish.map(
      (recommendation) => {
        const { candidato } = recommendation;
        const graduated = `${candidato?.cursoGraduacao} - ${candidato?.instituicaoGraduacao}`;
        const knownSince = `${recommendation.anoContato} por meio de ${this.getLabelKnowFron(recommendation)}`;
        const wasYour = this.getLabelWasYour(recommendation);
        const informations = recommendation.informacoes;
        const classification = this.getLabelClassificação(
          recommendation.classificacao,
        );
        const domain = this.getLabelAttribute(recommendation.dominio);
        const apprenticeship = this.getLabelAttribute(
          recommendation.aprendizado,
        );
        const attendance = this.getLabelAttribute(recommendation.assiduidade);
        const relationship = this.getLabelAttribute(
          recommendation.relacionamento,
        );
        const initiative = this.getLabelAttribute(recommendation.iniciativa);
        const expression = this.getLabelAttribute(recommendation.expressao);

        return {
          name: recommendation.nome,
          titration: recommendation.titulacao,
          institution: recommendation.instituicaoTitulacao,
          yearTitration: recommendation.anoTitulacao,
          institutionCurrent: recommendation.instituicaoAtual,
          position: recommendation.cargo,
          classification,
          knownSince,
          wasYour,
          informations,
          domain,
          apprenticeship,
          attendance,
          relationship,
          initiative,
          expression,
          candidate: {
            name: candidato.nome,
            graduated,
          },
        };
      },
    );
    return recommendationsFormated;
  }
}

export default new CandidatoRecomendacaoService();
