import { CandidatoPublicacao, PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../utils/baseError';
import {
  PublicacaoCreate,
  PublicacaoCreateDto,
  PublicacoesData,
  TYPES_PUBLICACAO,
} from './candidato.publicacao.types';

const prisma = new PrismaClient();

interface ProcessarPublicacoesParams {
  uid: number;
  publicacoes: PublicacoesData;
}

type ResponseListPublicacoes = {
  periodicos: CandidatoPublicacao[];
  conferencias: CandidatoPublicacao[];
};

class CandidatoPublicacaoService {
  async deleteAllPublicacoes(candidatoId: number): Promise<void> {
    await prisma.candidatoPublicacao.deleteMany({
      where: {
        candidatoId,
      },
    });
  }
  async addMany(
    candidatoId: number,
    publicacoes: PublicacaoCreateDto[],
    tipoPublicacao: number,
  ): Promise<void> {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map(
        (publicacao): PublicacaoCreate => {
          const ano = publicacao.ano ? Number(publicacao.ano) : null;

          return {
            candidatoId,
            titulo: publicacao.titulo || '',
            local: publicacao.local || '',
            tipoId: tipoPublicacao,
            natureza: publicacao.natureza || '',
            autores: publicacao.autores.nomeCompleto
              .join(', ')
              .substring(0, 255),
            issn: publicacao.issn || '',
            ano: ano || null,
          };
        },
      );
      await prisma.$transaction(async (prisma) => {
        try {
          for (const publicacao of publicacoesParaInserir) {
            const existingPublication =
              await prisma.candidatoPublicacao.findFirst({
                where: {
                  candidatoId,
                  titulo: publicacao.titulo,
                  ano: publicacao.ano,
                  tipoId: tipoPublicacao,
                },
              });

            if (existingPublication) {
              await prisma.candidatoPublicacao.update({
                where: {
                  id_candidatoId: {
                    id: existingPublication.id,
                    candidatoId: existingPublication.candidatoId,
                  },
                },
                data: publicacao,
              });
            } else {
              await prisma.candidatoPublicacao.create({
                data: publicacao,
              });
            }
          }
        } catch (error) {
          throw new BaseError(
            'Erro ao adicionar publicação para o candidato',
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
      });
    }
  }

  async getPublicacoes(candidatoId: number): Promise<ResponseListPublicacoes> {
    try {
      const [periodicos, conferencias] = await Promise.all([
        prisma.candidatoPublicacao.findMany({
          where: {
            candidatoId,
            tipoId: TYPES_PUBLICACAO.PERIODICOS,
          },
        }),
        prisma.candidatoPublicacao.findMany({
          where: {
            candidatoId,
            tipoId: TYPES_PUBLICACAO.EVENTOS,
          },
        }),
      ]);

      return {
        periodicos,
        conferencias,
      };
    } catch (error) {
      throw new BaseError(
        'Erro ao buscar publicações do candidato',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processPublicacoes({
    uid,
    publicacoes,
  }: ProcessarPublicacoesParams): Promise<void> {
    const {
      'ARTIGO-PUBLICADO': periodicos,
      'TRABALHO-EM-EVENTOS': eventos,
      'LIVRO-PUBLICADO-OU-ORGANIZADO': livros,
      'CAPITULO-DE-LIVRO-PUBLICADO': capitulos,
      'OUTRA-PRODUCAO-BIBLIOGRAFICA': outras,
      'PREFACIO-POSFACIO': prefacios,
    } = publicacoes;
    await prisma.candidatoPublicacao.deleteMany({
      where: {
        candidatoId: uid,
      },
    });

    await Promise.all([
      this.addMany(uid, periodicos, TYPES_PUBLICACAO.PERIODICOS),
      this.addMany(uid, eventos, TYPES_PUBLICACAO.EVENTOS),
      this.addMany(uid, livros, TYPES_PUBLICACAO.LIVROS),

      this.addMany(uid, capitulos, TYPES_PUBLICACAO.CAPITULOS),
      this.addMany(uid, outras, TYPES_PUBLICACAO.OUTRAS),
      this.addMany(uid, prefacios, TYPES_PUBLICACAO.PREFACIOS),
    ]);
  }
}

export default new CandidatoPublicacaoService();
