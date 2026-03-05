import prisma from '@client/prismaClient';
import { Prisma, Publicacao } from '@prisma/client';
import getPublicationsArr from '@utils/listaPublicacoes';
import { distance } from 'fastest-levenshtein';

class ProjetoService {
  async adicionarVarios(
    professorId: number,
    publicacoes: Partial<Publicacao>[],
  ): Promise<void> {
    if (publicacoes === undefined) return;

    const tipos = await prisma.tipoPublicacao.findMany();
    const publicArrRaw = await getPublicationsArr(
      publicacoes,
      professorId,
      tipos,
    );

    // garante campos obrigatórios do model (autores/issn) + normalizações
    const publicArr = publicArrRaw.map((p) => {
      const titulo = (p.titulo ?? '').trim();
      const autores = (p.autores ?? '').trim(); // obrigatório no schema
      const issn = (p.issn ?? '').trim(); // obrigatório no schema

      if (!titulo) throw new Error('Publicação sem título (titulo vazio).');
      if (!p.ano || Number.isNaN(Number(p.ano))) {
        throw new Error(`Publicação "${titulo}" com ano inválido.`);
      }
      if (!p.tipoId) throw new Error(`Publicação "${titulo}" sem tipoId.`);

      return {
        ...p,
        titulo,
        autores,
        issn,
      } as Prisma.PublicacaoCreateInput; // ou Prisma.PublicacaoUncheckedCreateInput
    });

    await prisma.$transaction(async (tx) => {
      const professor = await tx.usuario.findUnique({
        where: { id: professorId },
        include: {
          publicacoes: { include: { publicacao: true } },
        },
      });

      const publicacoesExistentes =
        professor?.publicacoes.map((rel) => rel.publicacao) || [];

      // Remove relações antigas do professor e apaga publicações órfãs (iguais ao teu fluxo)
      if (publicacoesExistentes.length > 0) {
        const idsExistentes = publicacoesExistentes.map((p) => p.id);

        const todasRelacoes = await tx.usuarioPublicacao.findMany({
          where: { publicacaoId: { in: idsExistentes } },
          select: { publicacaoId: true, usuarioId: true },
        });

        const idsAExcluir = idsExistentes.filter((publicacaoId) => {
          const outraRelacao = todasRelacoes.find(
            (e) =>
              e.publicacaoId === publicacaoId && e.usuarioId !== professorId,
          );
          return !outraRelacao;
        });

        await tx.usuario.update({
          where: { id: professorId },
          data: {
            publicacoes: {
              deleteMany: { publicacaoId: { in: idsAExcluir } },
            },
          },
        });

        if (idsAExcluir.length) {
          await tx.publicacao.deleteMany({
            where: { id: { in: idsAExcluir } },
          });
        }
      }

      // Pré-carrega por (ano+tipoId) pra reduzir consultas dentro do loop
      const pares = new Map<string, { ano: number; tipoId: number }>();
      for (const p of publicArr)
        pares.set(`${p.ano}:${p.tipoId}`, { ano: p.ano, tipoId: p.tipoId });

      const paresArr = Array.from(pares.values());
      const existentesPorAnoTipo = await tx.publicacao.findMany({
        where: {
          OR: paresArr.map(({ ano, tipoId }) => ({ ano, tipoId })),
        },
        select: { id: true, titulo: true, ano: true, tipoId: true, issn: true },
      });

      const bucket = new Map<string, typeof existentesPorAnoTipo>();
      for (const e of existentesPorAnoTipo) {
        const key = `${e.ano}:${e.tipoId}`;
        const arr = bucket.get(key) ?? [];
        arr.push(e);
        bucket.set(key, arr);
      }

      // helper simples pra normalizar título antes do levenshtein
      const norm = (s: string) =>
        s
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

      for (const pub of publicArr) {
        const key = `${pub.ano}:${pub.tipoId}`;
        const candidatos = bucket.get(key) ?? [];

        // 1) se tiver ISSN, tenta bater por ISSN primeiro (bem mais confiável)
        let unica = pub.issn
          ? candidatos.find((c) => c.issn && c.issn === pub.issn)
          : undefined;

        // 2) senão, tenta bater por similaridade do título
        if (!unica) {
          const alvo = norm(pub.titulo);
          unica = candidatos.find((c) => distance(norm(c.titulo), alvo) <= 3);
        }

        // 3) cria se não achou
        if (!unica) {
          const criada = await tx.publicacao.create({ data: pub });
          unica = {
            id: criada.id,
            titulo: criada.titulo,
            ano: criada.ano,
            tipoId: criada.tipoId,
            issn: criada.issn,
          };

          // mantém o bucket atualizado pra evitar duplicar dentro do mesmo batch
          candidatos.push(unica);
          bucket.set(key, candidatos);
        }

        // 4) cria relação sem duplicar
        // (recomendo ter unique([usuarioId, publicacaoId]) no model UsuarioPublicacao)
        await tx.usuarioPublicacao.upsert({
          where: {
            usuarioId_publicacaoId: {
              usuarioId: professorId,
              publicacaoId: unica.id,
            },
          },
          create: {
            usuarioId: professorId,
            publicacaoId: unica.id,
          },
          update: {},
        });
      }
    });
  }
}
export default new ProjetoService();
