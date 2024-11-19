import { PrismaClient } from '@prisma/client';
import { TYPES_PUBLICACAO } from './candidato.publicacao.types';
const prisma = new PrismaClient();

interface Publicacao {
  titulo?: string;
  ano?: string | number;
  local?: string;
  natureza?: string;
  autores: {
    nomeCompleto: string[];
  };
  issn?: string;
}

class CandidatoPublicacaoService {
  async adicionarVarios(
    candidatoId: number,
    publicacoes: Publicacao[],
    tipoPublicacao: number,
  ): Promise<void> {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map((publicacao) => {
        const ano = publicacao.ano ? parseInt(publicacao.ano.toString()) : null;

        const publicacaoData: any = {
          candidatoId,
          titulo: publicacao.titulo || '',
          local: publicacao.local || '',
          tipo: tipoPublicacao,
          natureza: publicacao.natureza || '',
          autores: publicacao.autores.nomeCompleto.join(', ').substring(0, 255),
          issn: publicacao.issn !== undefined ? publicacao.issn : '',
        };

        if (ano !== null) {
          publicacaoData.ano = ano;
        }

        return publicacaoData;
      });

      for (const publicacao of publicacoesParaInserir) {
        try {
          const existingPublication =
            await prisma.candidatoPublicacao.findFirst({
              where: {
                candidatoId,
                titulo: publicacao.titulo,
                ano: publicacao.ano,
                tipo: tipoPublicacao,
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
        } catch (error) {
          console.error(
            `Erro ao adicionar/atualizar publicação ${publicacao.titulo} para o candidato ${candidatoId}: ${error}`,
          );
          throw new Error('Não foi possível criar/atualizar a publicação');
        }
      }
    }
  }

  async ListarPublicacoesCandidate(
    candidatoId: number,
  ): Promise<{ periodicos: any[]; conferencias: any[] }> {
    try {
      const periodicos = await prisma.candidatoPublicacao.findMany({
        where: {
          candidatoId,
          tipo: TYPES_PUBLICACAO.PERIODICOS,
        },
      });

      const conferencias = await prisma.candidatoPublicacao.findMany({
        where: {
          candidatoId,
          tipo: TYPES_PUBLICACAO.EVENTOS,
        },
      });

      const data = {
        periodicos,
        conferencias,
      };
      return data;
    } catch (error) {
      console.error(
        `Erro ao listar publicações do candidato ${candidatoId}: ${error}`,
      );
      throw new Error('Não foi possível listar as publicações');
    }
  }
}

export default new CandidatoPublicacaoService();
