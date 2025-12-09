import prisma from '@client/prismaClient';
import { Prisma, Publicacao } from '@prisma/client';
import { distance } from 'fastest-levenshtein';
import getPublicationsArr from '../../utils/listaPublicacoes';
import { ContagemResult, PublicacaoCount } from './publicacao.types';

class PublicacaoService {
  async adicionarVarios(
    professorId: number,
    publicacoes: Partial<Publicacao>[],
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
  async listarTodos(tipo: number[] = [], ano?: unknown) {
    try {
      const whereConditions: Prisma.PublicacaoWhereInput = {
        tipoId: tipo.length ? { in: tipo } : undefined,
        ano: ano
          ? {
              in: []
                .concat(ano)
                .map(Number)
                .filter((n) => !isNaN(n)),
            }
          : undefined,
      };

      return await prisma.publicacao.findMany({
        where: whereConditions,
        include: { usuarioPublicacoes: true },
      });
    } catch (error) {
      throw new Error(`Erro ao listar publicações: ${error}`);
    }
  }
  async contarTodos(): Promise<ContagemResult> {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 14;
    const anos = Array.from({ length: 15 }, (_, i) => startYear + i);

    // IDs dos tipos (evite números mágicos; pegue pelos 'chave' se preferir)
    const TIPO_CONFERENCIA = 1; // TRABALHO-EM-EVENTOS
    const TIPO_PERIODICO = 2; // ARTIGO-PUBLICADO

    const grouped = await prisma.publicacao.groupBy({
      by: ['ano', 'tipoId'],
      where: {
        tipoId: { in: [TIPO_CONFERENCIA, TIPO_PERIODICO] },
        ano: { gte: startYear },
      },
      _count: { _all: true },
      orderBy: [{ ano: 'asc' }, { tipoId: 'asc' }],
    });

    // Indexa por "ano:tipoId" para preencher zeros nos anos sem registros
    const idx = new Map<string, number>();
    for (const row of grouped) {
      idx.set(`${row.ano}:${row.tipoId}`, row._count._all);
    }

    const Conferencia = anos.map(
      (ano) => idx.get(`${ano}:${TIPO_CONFERENCIA}`) ?? 0,
    );
    const Periodico = anos.map(
      (ano) => idx.get(`${ano}:${TIPO_PERIODICO}`) ?? 0,
    );

    return {
      contagemTotal: { Conferencia, Periodico },
      anos,
    };
  }
}

export default new PublicacaoService();
