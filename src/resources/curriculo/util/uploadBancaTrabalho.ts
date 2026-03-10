import prisma from '@client/prismaClient';
import { Prisma } from '@prisma/client';
import { distance } from 'fastest-levenshtein';

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function norm(s?: string | null) {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getChildByPrefix(obj: any, prefix: string): any | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const key = Object.keys(obj).find((k) => k.startsWith(prefix));
  return key ? obj[key] : undefined;
}

function maxDistFor(a: string, b: string) {
  const L = Math.max(a.length, b.length, 1);
  // 3% do tamanho, com piso 2 e teto 10
  return Math.min(10, Math.max(2, Math.floor(L * 0.03)));
}

type BancaTag =
  | 'PARTICIPACAO-EM-BANCA-DE-MESTRADO'
  | 'PARTICIPACAO-EM-BANCA-DE-DOUTORADO'
  | 'PARTICIPACAO-EM-BANCA-DE-EXAME-QUALIFICACAO'
  | 'PARTICIPACAO-EM-BANCA-DE-APERFEICOAMENTO-ESPECIALIZACAO'
  | 'PARTICIPACAO-EM-BANCA-DE-GRADUACAO'
  | 'OUTRAS-PARTICIPACOES-EM-BANCA';

const TAGS: BancaTag[] = [
  'PARTICIPACAO-EM-BANCA-DE-MESTRADO',
  'PARTICIPACAO-EM-BANCA-DE-DOUTORADO',
  'PARTICIPACAO-EM-BANCA-DE-EXAME-QUALIFICACAO',
  'PARTICIPACAO-EM-BANCA-DE-APERFEICOAMENTO-ESPECIALIZACAO',
  'PARTICIPACAO-EM-BANCA-DE-GRADUACAO',
  'OUTRAS-PARTICIPACOES-EM-BANCA',
];

// mapeia a tag do XML para o tipoBancaDeTrabalho que você vai guardar
function mapTipoBanca(tag: BancaTag, dadosBasicos: any): string {
  switch (tag) {
    case 'PARTICIPACAO-EM-BANCA-DE-MESTRADO':
      // no mestrado existe atributo TIPO (ACADEMICO/PROFISSIONALIZANTE)
      return dadosBasicos?.['TIPO'] &&
        dadosBasicos?.['TIPO'] !== 'NAO_INFORMADO'
        ? `MESTRADO_${String(dadosBasicos['TIPO']).toUpperCase()}`
        : 'MESTRADO';
    case 'PARTICIPACAO-EM-BANCA-DE-DOUTORADO':
      return 'DOUTORADO';
    case 'PARTICIPACAO-EM-BANCA-DE-EXAME-QUALIFICACAO':
      return 'QUALIFICACAO';
    case 'PARTICIPACAO-EM-BANCA-DE-APERFEICOAMENTO-ESPECIALIZACAO':
      return 'ESPECIALIZACAO';
    case 'PARTICIPACAO-EM-BANCA-DE-GRADUACAO':
      return 'GRADUACAO';
    case 'OUTRAS-PARTICIPACOES-EM-BANCA':
      // existe atributo TIPO nas “outras”
      return dadosBasicos?.['TIPO']
        ? `OUTRAS_${String(dadosBasicos['TIPO']).toUpperCase()}`
        : 'OUTRAS';
  }
}

export async function uploadBancas(
  dadosComplementares: any,
  professorId: number,
  tx?: Prisma.TransactionClient,
) {
  const client = tx ?? prisma;

  const bloco =
    dadosComplementares?.['PARTICIPACAO-EM-BANCA-TRABALHOS-CONCLUSAO'];
  if (!bloco) return;

  // flat list de itens (tag + item)
  const items: Array<{ tag: BancaTag; item: any }> = [];
  for (const tag of TAGS) {
    for (const item of asArray<any>(bloco[tag])) {
      items.push({ tag, item });
    }
  }
  if (!items.length) return;

  // garante que usamos trx mesmo se client for tx externo
  const db = tx;

  // 1) sync: remove participações do professor em bancas de trabalho
  await db.lattesParticipacaoBancaDeTrabalho.deleteMany({
    where: { professorId },
  });

  // 2) apaga bancas órfãs
  const orfas = await db.lattesBancaDeTrabalho.findMany({
    where: { LattesParticipacaoBancaDeTrabalho: { none: {} } },
    select: { bancaDeTrabalhoId: true },
  });
  if (orfas.length) {
    await db.lattesBancaDeTrabalho.deleteMany({
      where: {
        bancaDeTrabalhoId: { in: orfas.map((o) => o.bancaDeTrabalhoId) },
      },
    });
  }

  // 3) processa itens
  for (const { tag, item } of items) {
    const dadosBasicos =
      getChildByPrefix(item, 'DADOS-BASICOS-') ?? item?.['DADOS-BASICOS'] ?? {};
    const detalhamento =
      getChildByPrefix(item, 'DETALHAMENTO-') ?? item?.['DETALHAMENTO'] ?? {};

    const ano = Number(dadosBasicos?.['ANO']);
    if (!Number.isFinite(ano) || ano <= 0) continue;

    const titulo = String(dadosBasicos?.['TITULO'] ?? '').trim();
    if (!titulo) continue;

    const natureza = (dadosBasicos?.['NATUREZA'] ?? null) as string | null;
    const tipoBancaDeTrabalho = mapTipoBanca(tag, dadosBasicos);

    const nomeCandidato = (detalhamento?.['NOME-DO-CANDIDATO'] ?? null) as
      | string
      | null;
    const nomeInstituicao = (detalhamento?.['NOME-INSTITUICAO'] ?? null) as
      | string
      | null;
    const nomeCurso = (detalhamento?.['NOME-CURSO'] ?? null) as string | null;

    // --- tenta encontrar banca existente (heurística) ---
    // busca candidatas por ano + tipo primeiro (reduz universo)
    const candidatas = await db.lattesBancaDeTrabalho.findMany({
      where: { anoBancaDeTrabalho: ano, tipoBancaDeTrabalho },
      select: {
        bancaDeTrabalhoId: true,
        tituloBancaDeTrabalho: true,
        nomeCandidato: true,
        nomeInstituicao: true,
        nomeCurso: true,
      },
    });

    const alvoTitulo = norm(titulo);
    const alvoCand = norm(nomeCandidato ?? '');
    const tituloMax = maxDistFor(alvoTitulo, alvoTitulo);

    let best: { id: number; dTitulo: number; dCand: number } | null = null;

    for (const c of candidatas) {
      const candTitulo = norm(c.tituloBancaDeTrabalho);
      const dTitulo = distance(candTitulo, alvoTitulo);
      const maxTitulo = maxDistFor(candTitulo, alvoTitulo);
      if (dTitulo > maxTitulo) {
        if (professorId === 79) {
          console.log('Conicide', c);
        }
        continue;
      }

      // candidato: se vier no XML, exige aproximar também (evita colidir títulos iguais)
      let dCand = 0;
      if (alvoCand) {
        const candCandidato = norm(c.nomeCandidato ?? '');
        dCand = distance(candCandidato, alvoCand);
        const maxCand = Math.min(
          8,
          Math.max(1, Math.floor(Math.max(alvoCand.length, 1) * 0.15)),
        );
        if (dCand > maxCand) continue;
      }

      // se instituição/curso vierem no XML, usa como filtro leve (igualdade normalizada)
      if (
        nomeInstituicao &&
        norm(c.nomeInstituicao ?? '') &&
        norm(c.nomeInstituicao ?? '') !== norm(nomeInstituicao)
      ) {
        // não descarta se o DB estiver vazio, mas se tiver diferente, descarta
        continue;
      }
      if (
        nomeCurso &&
        norm(c.nomeCurso ?? '') &&
        norm(c.nomeCurso ?? '') !== norm(nomeCurso)
      ) {
        continue;
      }

      if (
        !best ||
        dTitulo < best.dTitulo ||
        (dTitulo === best.dTitulo && dCand < best.dCand)
      ) {
        best = { id: c.bancaDeTrabalhoId, dTitulo, dCand };
      }

      if (dTitulo === 0 && (!alvoCand || dCand === 0)) break;
    }

    let bancaId: number;
    if (best) {
      bancaId = best.id;
    } else {
      const criada = await db.lattesBancaDeTrabalho.create({
        data: {
          naturezaBancaDeTrabalho: natureza,
          tipoBancaDeTrabalho,
          tituloBancaDeTrabalho: titulo,
          anoBancaDeTrabalho: ano,
          nomeCandidato,
          nomeInstituicao,
          nomeCurso,
        },
        select: { bancaDeTrabalhoId: true },
      });
      bancaId = criada.bancaDeTrabalhoId;
    }

    // --- cria relação professor <-> banca (PK composta) ---
    await db.lattesParticipacaoBancaDeTrabalho.upsert({
      where: {
        bancaDeTrabalhoId_professorId: {
          bancaDeTrabalhoId: bancaId,
          professorId,
        },
      },
      create: {
        bancaDeTrabalhoId: bancaId,
        professorId,
      },
      update: {},
    });
  }
}
