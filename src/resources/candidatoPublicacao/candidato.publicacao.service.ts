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
  ISSN?: string;
}

class CandidatoPublicacaoService {
  async adicionarVarios(
    idCandidato: number,
    publicacoes: Publicacao[],
    tipoPublicacao: number,
  ): Promise<void> {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map((publicacao) => {
        const ano = publicacao.ano ? parseInt(publicacao.ano.toString()) : null;

        const publicacaoData: any = {
          idCandidato,
          titulo: publicacao.titulo || '',
          local: publicacao.local || '',
          tipo: tipoPublicacao,
          natureza: publicacao.natureza || '',
          autores: publicacao.autores.nomeCompleto.join(', ').substring(0, 255),
          ISSN: publicacao.ISSN !== undefined ? publicacao.ISSN : '',
        };

        if (ano !== null) {
          publicacaoData.ano = ano;
        }

        return publicacaoData;
      });

      for (const publicacao of publicacoesParaInserir) {
        try {
          const existingPublication =
            await prisma.candidatoPublicacoes.findFirst({
              where: {
                idCandidato,
                titulo: publicacao.titulo,
                ano: publicacao.ano,
                tipo: tipoPublicacao,
              },
            });

          if (existingPublication) {
            await prisma.candidatoPublicacoes.update({
              where: {
                id_idCandidato: {
                  id: existingPublication.id,
                  idCandidato: existingPublication.idCandidato,
                },
              },
              data: publicacao,
            });
            console.log(
              `Publicação ${publicacao.titulo} atualizada com sucesso para o candidato ${idCandidato}!`,
            );
          } else {
            await prisma.candidatoPublicacoes.create({
              data: publicacao,
            });
            console.log(
              `Publicação ${publicacao.titulo} adicionada com sucesso para o candidato ${idCandidato}!`,
            );
          }
        } catch (error) {
          console.error(
            `Erro ao adicionar/atualizar publicação ${publicacao.titulo} para o candidato ${idCandidato}: ${error}`,
          );
          throw new Error('Não foi possível criar/atualizar a publicação');
        }
      }
    }
  }

  async ListarPublicacoesCandidate(
    idCandidato: number,
  ): Promise<{ periodicos: any[]; conferencias: any[] }> {
    try {
      const periodicos = await prisma.candidatoPublicacoes.findMany({
        where: {
          idCandidato,
          tipo: TYPES_PUBLICACAO.PERIODICOS,
        },
      });

      const conferencias = await prisma.candidatoPublicacoes.findMany({
        where: {
          idCandidato,
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
        `Erro ao listar publicações do candidato ${idCandidato}: ${error}`,
      );
      throw new Error('Não foi possível listar as publicações');
    }
  }
}

export default new CandidatoPublicacaoService();
