import prisma from '@client/prismaClient';
import { Prisma, Publicacao } from '@prisma/client';
import { distance } from 'fastest-levenshtein';
import getPublicationsArr from '../../utils/listaPublicacoes';
import { ContagemResult } from '@resources/publicacao/publicacao.types';

class PublicacaoService {
  async adicionarVarios(
    professorId: number,
    publicacoes: Partial<Publicacao>[],
  ): Promise<void> {
    if (!Object.keys(publicacoes).length) return;
    const tipos = await prisma.tipoPublicacao.findMany();
    const publicArrRaw = await getPublicationsArr(
      publicacoes,
      professorId,
      tipos,
    );

    const normTitle = (s: string) =>
      (s ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const normLocal = (s: string | null | undefined) =>
      (s ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // valida + garante obrigatórios do schema
    const publicArr = publicArrRaw
      .map((p) => {
        const titulo = (p.titulo ?? '').trim();
        const ano = Number(p.ano);
        const tipoId = Number(p.tipoId);

        if (!titulo) return null;
        if (!Number.isFinite(ano) || ano <= 0) return null;
        if (!Number.isFinite(tipoId) || tipoId <= 0) return null;

        const autores = (p.autores ?? '').trim() || 'Não informado';
        const issn = (p.issn ?? '').trim() || 'Não informado';

        return {
          ...p,
          titulo,
          ano,
          tipoId,
          autores,
          issn,
        } as Prisma.PublicacaoUncheckedCreateInput;
      })
      .filter((x): x is Prisma.PublicacaoUncheckedCreateInput => !!x);

    if (!publicArr.length) return;

    await prisma.$transaction(async (tx) => {
      // 1) Apaga todas as relações do professor
      await tx.usuarioPublicacao.deleteMany({
        where: { usuarioId: professorId },
      });

      // 2) Apaga publicações órfãs (sem nenhuma relação)
      const orfas = await tx.publicacao.findMany({
        where: { usuarioPublicacoes: { none: {} } },
        select: { id: true },
      });

      if (orfas.length) {
        await tx.publicacao.deleteMany({
          where: { id: { in: orfas.map((o) => o.id) } },
        });
      }

      // 3) Para cada publicação do input:
      //    - tenta achar uma existente por similaridade do título (mesmo ano + tipo)
      //    - se não achar, cria
      //    - cria a relação usuarioPublicacao (upsert pelo unique composto)
      for (const pub of publicArr) {
        const alvoTitulo = normTitle(pub.titulo);
        const alvoLocal = normLocal(pub.local);

        const candidatos = await tx.publicacao.findMany({
          where: { ano: pub.ano, tipoId: pub.tipoId },
          select: { id: true, titulo: true, local: true },
        });

        // tolerância do título (você estava usando 1% — eu manteria 2%~3% pra título)
        const maxDistTitulo = Math.min(
          10,
          Math.max(2, Math.floor(Math.max(alvoTitulo.length, 1) * 0.02)),
        );

        // tolerância do local (local costuma ser pequeno: congresso/jornal)
        const maxDistLocal = Math.min(
          8,
          Math.max(1, Math.floor(Math.max(alvoLocal.length, 1) * 0.15)),
        );

        let best: any | null = null;

        for (const c of candidatos) {
          const candTitulo = normTitle(c.titulo);
          const dTitulo = distance(candTitulo, alvoTitulo);
          if (dTitulo > maxDistTitulo) continue;

          // Se o input tem local, exige match de local também
          let dLocal = 0;
          if (alvoLocal) {
            const candLocal = normLocal(c.local);
            dLocal = distance(candLocal, alvoLocal);
            if (dLocal > maxDistLocal) continue;
          }

          // escolhe o melhor: primeiro menor distância do título; empate -> menor do local
          if (
            !best ||
            dTitulo < best.dTitulo ||
            (dTitulo === best.dTitulo && dLocal < best.dLocal)
          ) {
            best = { id: c.id, dTitulo, dLocal, alvoTitulo, candTitulo };
          }

          // match perfeito (título igual e, se houver local, local igual)
          if (dTitulo === 0 && (!alvoLocal || dLocal === 0)) break;
        }

        let publicacaoId: number;
        if (best) {
          console.log(best);
          publicacaoId = best.id;
        } else {
          const criada = await tx.publicacao.create({
            data: pub,
            select: { id: true },
          });
          publicacaoId = criada.id;
        }

        await tx.usuarioPublicacao.upsert({
          where: {
            usuarioId_publicacaoId: {
              usuarioId: professorId,
              publicacaoId,
            },
          },
          create: {
            usuarioId: professorId,
            publicacaoId,
            natureza: pub.natureza,
          },
          update: {},
        });
      }
    });
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
        include: { usuarioPublicacoes: true, tipo: true },
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
