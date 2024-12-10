import { CandidatoPublicacao, Prisma, PrismaClient } from '@prisma/client';
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
  async adicionarVarios(
    candidatoId: number,
    publicacoes: PublicacaoCreateDto[],
    tipoPublicacao: number,
  ): Promise<void> {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map(
        (publicacao): PublicacaoCreate => {
          const ano = publicacao.ano ? Number(publicacao.ano) : null;

          const publicacaoData: PublicacaoCreate = {
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

          return publicacaoData;
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
              console.log(
                `Publicação ${publicacao.titulo} atualizada com sucesso para o candidato ${candidatoId}!`,
              );
            } else {
              await prisma.candidatoPublicacao.create({
                data: publicacao,
              });
              console.log(
                `Publicação ${publicacao.titulo} adicionada com sucesso para o candidato ${candidatoId}!`,
              );
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

  async publicacoesCandidato(
    candidatoId: number,
  ): Promise<ResponseListPublicacoes> {
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

  async processarPublicacoes({
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

    const promessas = [
      this.adicionarVarios(uid, periodicos, TYPES_PUBLICACAO.PERIODICOS),
      this.adicionarVarios(uid, eventos, TYPES_PUBLICACAO.EVENTOS),
      this.adicionarVarios(uid, livros, TYPES_PUBLICACAO.LIVROS),
      this.adicionarVarios(uid, capitulos, TYPES_PUBLICACAO.CAPITULOS),
      this.adicionarVarios(uid, outras, TYPES_PUBLICACAO.OUTRAS),
      this.adicionarVarios(uid, prefacios, TYPES_PUBLICACAO.PREFACIOS),
    ];

    const resultados = await Promise.allSettled(promessas);

    resultados.forEach((resultado, indice) => {
      if (resultado.status === 'fulfilled') {
        console.log(`Operação ${indice + 1} concluída com sucesso.`);
        console.log('Resultado:', resultado.value);
      } else {
        console.error(`Operação ${indice + 1} falhou.`);
        console.error('Erro:', resultado.reason);
      }
    });
  }
}

export default new CandidatoPublicacaoService();
