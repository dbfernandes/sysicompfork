import { PrismaClient, Publicacao } from '@prisma/client';
import { distance } from 'fastest-levenshtein';
import getPublicationsArr from '../../utils/listaPublicacoes';
import { ContagemResult, PublicacaoCount } from './publicacao.types';

const prisma = new PrismaClient();

class PublicacaoService {
  async adicionarVarios(
    professorId: number,
    publicacoes: Publicacao[],
  ): Promise<void> {
    if (publicacoes !== undefined) {
      const tipos = await prisma.tipoPublicacao.findMany();
      const publicArr = await getPublicationsArr(
        publicacoes,
        professorId,
        tipos,
      );

      const professor = await prisma.usuario.findUnique({
        where: { id: professorId },
        include: {
          publicacoes: {
            include: {
              publicacao: true,
            },
          },
        },
      });

      const publicacoesExistentes =
        professor?.publicacoes.map((rel) => rel.publicacao) || [];
      if (publicacoesExistentes.length > 0) {
        const idPublicacoesExistentes = publicacoesExistentes.map((p) => p.id);

        const todasRelacoes = await prisma.usuarioPublicacao.findMany({
          where: {
            publicacaoId: { in: idPublicacoesExistentes },
          },
        });

        const idPublicacoesAExcluir = idPublicacoesExistentes.filter(
          (publicacaoId) => {
            const outraRelacao = todasRelacoes.find(
              (e) =>
                e.publicacaoId === publicacaoId && e.usuarioId !== professorId,
            );
            return !outraRelacao;
          },
        );

        await prisma.usuario.update({
          where: { id: professorId },
          data: {
            publicacoes: {
              deleteMany: {
                publicacaoId: { in: idPublicacoesAExcluir },
              },
            },
          },
        });

        await prisma.publicacao.deleteMany({
          where: { id: { in: idPublicacoesAExcluir } },
        });
      }

      for (const publicacao of publicArr) {
        const publicacoesMesmoAno = await prisma.publicacao.findMany({
          where: {
            ano: publicacao.ano,
          },
          select: {
            id: true,
            titulo: true,
          },
        });

        let unicaPublicacao = publicacoesMesmoAno.find(
          (p) => distance(p.titulo, publicacao.titulo) <= 3,
        );

        if (!unicaPublicacao) {
          unicaPublicacao = await prisma.publicacao.create({
            data: publicacao,
          });
        }

        await prisma.usuarioPublicacao.create({
          data: {
            usuarioId: professorId,
            publicacaoId: unicaPublicacao.id,
          },
        });
      }
    }
  }

  async listarTodos(conditions: any) {
    const publicacoes = await prisma.publicacao.findMany({
      where: conditions || {},
      include: {
        usuarioPublicacoes: true,
      },
    });
    return publicacoes;
  }

  async contarTodos(): Promise<ContagemResult> {
    try {
      const currentYear = new Date().getFullYear();
      const anos = Array.from({ length: 15 }, (_, i) => currentYear - 14 + i);

      const counts = await prisma.$queryRaw<PublicacaoCount[]>`
        SELECT 
          ano,
          tipo,
          COUNT(*) as total
        FROM Publicacao
        WHERE 
          tipo IN (1, 2)
          AND ano >= ${currentYear - 14}
        GROUP BY ano, tipo
        ORDER BY ano, tipo
      `;

      const contagemTotal = {
        Conferencia: anos.map(
          (ano) =>
            counts.find((c) => c.ano === ano && c.tipo === 1)?._count._all ?? 0,
        ),
        Periodico: anos.map(
          (ano) =>
            counts.find((c) => c.ano === ano && c.tipo === 2)?._count._all ?? 0,
        ),
      };

      return {
        contagemTotal,
        anos,
      };
    } catch (error) {
      console.error('Erro ao contar publicações:', error);
      throw new Error('Falha ao contar publicações');
    }
  }
}

export default new PublicacaoService();
