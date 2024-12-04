import { PrismaClient, Prisma } from '@prisma/client';
import {
  Publicacao,
  TYPES_PUBLICACAO,
  PublicacoesResponse,
} from './candidato.publicacao.types';

const prisma = new PrismaClient();

class CandidatoPublicacaoService {
  async adicionarVarios(
    candidatoId: number,
    publicacoes: Publicacao[],
    tipoPublicacao: TYPES_PUBLICACAO,
  ): Promise<void> {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map(
        (publicacao): Prisma.CandidatoPublicacaoCreateInput => {
          const ano = publicacao.ano ? Number(publicacao.ano) : null;

          return {
            candidato: {
              connect: {
                id: candidatoId,
              },
            },
            titulo: publicacao.titulo || '',
            local: publicacao.local || '',
            tipoId: tipoPublicacao,
            natureza: publicacao.natureza || '',
            autores: publicacao.autores.nomeCompleto
              .join(', ')
              .substring(0, 255),
            issn: publicacao.ISSN ?? '',
            ano: ano ?? 0,
          };
        },
      );

      for (const publicacao of publicacoesParaInserir) {
        try {
          const existingPublication =
            await prisma.candidatoPublicacao.findFirst({
              where: {
                candidatoId,
                titulo: publicacao.titulo,
                ano: publicacao.ano ?? 0,
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
              data: {
                titulo: publicacao.titulo,
                local: publicacao.local,
                tipoId: tipoPublicacao,
                natureza: publicacao.natureza,
                autores: publicacao.autores,
                issn: publicacao.issn,
                ano: publicacao.ano,
              },
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
        } catch (error) {
          console.error(
            `Erro ao adicionar/atualizar publicação ${publicacao.titulo} para o candidato ${candidatoId}:`,
            error,
          );
          throw new Error('Não foi possível criar/atualizar a publicação');
        }
      }
    }
  }

  async ListarPublicacoesCandidato(
    candidatoId: number,
  ): Promise<PublicacoesResponse> {
    try {
      const periodicos = await prisma.candidatoPublicacao.findMany({
        where: {
          candidatoId,
          tipoId: TYPES_PUBLICACAO.PERIODICOS,
        },
      });

      const conferencias = await prisma.candidatoPublicacao.findMany({
        where: {
          candidatoId,
          tipoId: TYPES_PUBLICACAO.EVENTOS,
        },
      });

      return {
        periodicos,
        conferencias,
      };
    } catch (error) {
      console.error(
        `Erro ao listar publicações do candidato ${candidatoId}:`,
        error,
      );
      throw new Error('Não foi possível listar as publicações');
    }
  }
}

export default new CandidatoPublicacaoService();
