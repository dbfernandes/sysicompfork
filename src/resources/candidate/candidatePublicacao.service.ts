import { PrismaClient } from '@prisma/client'
import { CreateCandidatePublicationsDto } from './candidatePublicacao.types'

// const prisma = new PrismaClient()
// import { PrismaClient } from '@prisma/client';

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

class CandidatePublicacaoService {
  async adicionarVarios(
    idCandidate: number,
    publicacoes: Publicacao[],
    tipoPublicacao: number
  ): Promise<void> {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map((publicacao) => {
        const ano = publicacao.ano ? parseInt(publicacao.ano.toString()) : null;

        const publicacaoData: any = {
          idCandidate,
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
          const existingPublication = await prisma.candidatePublications.findFirst({
            where: {
              idCandidate,
              titulo: publicacao.titulo,
              ano: publicacao.ano,
              tipo: tipoPublicacao,
            },
          });

          if (existingPublication) {
            await prisma.candidatePublications.update({
              where: {
                id_idCandidate: {
                  id: existingPublication.id,
                  idCandidate: existingPublication.idCandidate,
                },
              },
              data: publicacao,
            });
            console.log(`Publicação ${publicacao.titulo} atualizada com sucesso para o candidato ${idCandidate}!`);
          } else {
            await prisma.candidatePublications.create({
              data: publicacao,
            });
            console.log(`Publicação ${publicacao.titulo} adicionada com sucesso para o candidato ${idCandidate}!`);
          }
        } catch (error) {
          console.error(
            `Erro ao adicionar/atualizar publicação ${publicacao.titulo} para o candidato ${idCandidate}: ${error}`
          );
          throw new Error('Não foi possível criar/atualizar a publicação');
        }
      }
    }
  }

  async ListarPublicacoesCandidate(idCandidate: number): Promise<{ periodicos: any[]; conferencias: any[] }> {
    try {
      const periodicos = await prisma.candidatePublications.findMany({
        where: {
          idCandidate,
          tipo: 1,
        },
      });

      const conferencias = await prisma.candidatePublications.findMany({
        where: {
          idCandidate,
          tipo: 2,
        },
      });

      const data = {
        periodicos,
        conferencias,
      };
      return data;
    } catch (error) {
      console.error(`Erro ao listar publicações do candidato ${idCandidate}: ${error}`);
      throw new Error('Não foi possível listar as publicações');
    }
  }
}

export default new CandidatePublicacaoService();
