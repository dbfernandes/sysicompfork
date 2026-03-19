import prisma from '@client/prismaClient';
import xml2json from 'xml2json';
import fs from 'fs/promises';
import path from 'path';
import { distance } from 'fastest-levenshtein';

import {
  getAtuacoesProfissionais,
  getDadosProfessor,
  getFormacaoAcademicaTitulacao,
  getPremiosTitulos,
} from '@resources/curriculo/teste';
import { uploadBancas } from '@resources/curriculo/util/uploadBancaTrabalho';
import { getCompleteFormDataFromFile } from '@resources/curriculo/extractorLattes';
import PublicacaoService from '@resources/publicacao/publicacao.service';
import { ProjetoParsed } from '@resources/projetos/projetos.types';
import ProjetoService from '@resources/projetos/projetos.service';

enum LattesStatus {
  ATUALIZADO = 'ATUALIZADO',
  DESATUALIZADO = 'DESATUALIZADO',
  SEM_REGISTROS = 'SEM_REGISTROS',
}
export function parseLattesDateTime(
  dataAtualizacao: string,
  horaAtualizacao?: string | null,
): Date {
  if (!/^\d{8}$/.test(dataAtualizacao)) {
    throw new Error('DATA-ATUALIZACAO inválida (esperado DDMMAAAA)');
  }

  const day = Number(dataAtualizacao.slice(0, 2));
  const month = Number(dataAtualizacao.slice(2, 4)); // 1..12
  const year = Number(dataAtualizacao.slice(4, 8));

  if (month < 1 || month > 12)
    throw new Error('Mês inválido em DATA-ATUALIZACAO');
  if (day < 1 || day > 31) throw new Error('Dia inválido em DATA-ATUALIZACAO');

  let hh = 0,
    mm = 0,
    ss = 0;

  const h = (horaAtualizacao ?? '').trim();

  if (h) {
    if (!/^\d{4}(\d{2})?$/.test(h)) {
      throw new Error('HORA-ATUALIZACAO inválida (esperado HHMMSS ou HHMM)');
    }

    hh = Number(h.slice(0, 2));
    mm = Number(h.slice(2, 4));
    ss = h.length === 6 ? Number(h.slice(4, 6)) : 0;

    if (hh > 23) throw new Error('Hora inválida em HORA-ATUALIZACAO');
    if (mm > 59) throw new Error('Minuto inválido em HORA-ATUALIZACAO');
    if (ss > 59) throw new Error('Segundo inválido em HORA-ATUALIZACAO');
  }

  return new Date(year, month - 1, day, hh, mm, ss, 0);
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

// se você já tem isso em outro lugar, reaproveite
function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function norm(s?: string | null) {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickFirst(obj: any, keys: string[]): any {
  for (const k of keys) {
    if (obj?.[k] !== undefined) return obj[k];
  }
  return undefined;
}

function getChildByPrefix(obj: any, prefix: string): any | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const key = Object.keys(obj).find((k) => k.startsWith(prefix));
  return key ? obj[key] : undefined;
}

function isComitePrograma(opts: { titulo?: string; alvo?: string }) {
  const titulo = opts.titulo || '';
  const alvo = opts.alvo || 'comite de programa';
  const t = norm(titulo ?? '');

  if (!t) return false;

  // 1) contém (mais confiável e rápido)
  if (t.includes(alvo)) return true;

  // 2) fallback: aproximação por distância
  // compara com janelas de tamanho parecido (evita comparar com texto muito grande)
  const words = t.split(' ');
  const alvoLen = alvo.split(' ').length;
  const maxDist = 3; // ajuste: 2-4 geralmente ok

  for (let i = 0; i <= words.length - alvoLen; i++) {
    const slice = words.slice(i, i + alvoLen).join(' ');
    if (distance(slice, alvo) <= maxDist) return true;
  }

  // fallback extra: compara a string inteira se for curta
  if (t.length <= 40 && distance(t, alvo) <= maxDist) return true;

  return false;
}

function compYears(yearComp: number, yearStart?: number, yearEnd?: number) {
  if (!Number.isFinite(yearComp)) return false;
  if (yearStart != null && yearComp < yearStart) return false;
  if (yearEnd != null && yearComp > yearEnd) return false;
  return true;
}
function overlapsYearsOngoing(
  eventStart: number,
  eventEnd: number | null | undefined,
  filterStart?: number,
  filterEnd?: number,
) {
  if (!Number.isFinite(eventStart)) return false;

  const currentYear = new Date().getFullYear();

  // Se ainda está ocorrendo, considera que vai até o ano atual (ou até o fim do filtro, se houver)
  const effectiveEventEnd = eventEnd ?? filterEnd ?? currentYear;

  const fs = filterStart ?? -Infinity;
  const fe = filterEnd ?? Infinity;

  // interseção dos intervalos
  return eventStart <= fe && effectiveEventEnd >= fs;
}

type QuerySearch = {
  yearStart?: number;
  yearEnd?: number;
};

class CurriculoService {
  async getAcompanhamentoLattes(queryInit?: QuerySearch) {
    const query = queryInit ?? {
      yearStart: null,
      yearEnd: null,
    };
    const staleLimit = addMonths(new Date(), -6);

    const professores = await prisma.usuario.findMany({
      where: { professor: 1, status: 1 },
      orderBy: { nomeCompleto: 'asc' },
      select: {
        id: true,
        nomeCompleto: true,
        ultimaAtualizacao: true,
        publicacoes: {
          include: {
            publicacao: {
              select: {
                ano: true,
                tipoId: true,
                natureza: true,
              },
            },
          },
        },
        projetos: {
          select: {
            dataInicio: true,
            dataFim: true,
            papel: true,
          },
        },
        orientacoes: {
          select: {
            tipo: true,
            ano: true,
            natureza: true,
          },
        },

        premios: {
          select: { id: true, updatedAt: true, ano: true },
        },
        LattesProfessor: true,
      },
    });

    const professorsData: any[] = await Promise.all(
      professores.map(async (p) => {
        const publicacoes = p.publicacoes
          .map((p) => ({
            ano: p.publicacao.ano,
            tipo: p.publicacao.tipoId,
            natureza: p.natureza,
          }))
          .filter((p) => p.tipo !== 1 || p.natureza === 'COMPLETO')
          .filter((pub) => compYears(pub.ano, query.yearStart, query.yearEnd));
        const projetos = p.projetos.filter((proj) =>
          overlapsYearsOngoing(
            proj.dataInicio,
            proj.dataFim,
            query.yearStart,
            query.yearEnd,
          ),
        );
        const orientacoes = p.orientacoes.filter((orie) =>
          compYears(orie.ano, query.yearStart, query.yearEnd),
        );
        const premios = p.premios.filter((prem) =>
          compYears(prem.ano, query.yearStart, query.yearEnd),
        );
        const status: LattesStatus = !p.ultimaAtualizacao
          ? LattesStatus.SEM_REGISTROS
          : p.ultimaAtualizacao < staleLimit
            ? LattesStatus.DESATUALIZADO
            : LattesStatus.ATUALIZADO;
        let dataAtualizacao: Date | null;
        let dataAtualizacaoFormatted: string;
        let hasMestrado = false;
        let hasDoutorado = false;
        let hasPos = false;
        let idLattes: null | string = null;

        const revPeriodico: any[] = [];
        const corpEditorial: any[] = [];

        const participacaoEvento: any[] = [];
        const organizacaoEvento: any[] = [];
        const bancas = {
          mestrado: [],
          doutorado: [],
          qualificacao: [],
          graduacao: [],
          outras: [],
        };
        const comiteTrabalho: any[] = [];
        const orgComitePrograma: any[] = [];

        if (p.LattesProfessor) {
          const professorId = p.LattesProfessor.professorId;
          idLattes = p.LattesProfessor.numeroCurriculo;

          const vinculos =
            await prisma.lattesVinculoAtuacaoProfissional.findMany({
              where: {
                professorId,
              },
            });
          const formacaoProfessor =
            await prisma.lattesFormacaoAcademicaTitulacao.findMany({
              where: {
                professorId,
              },
            });
          const eventosProfessor =
            await prisma.lattesParticipacaoEvento.findMany({
              where: {
                professorId,
              },
              include: {
                evento: true,
              },
            });
          const bancasTrabalho =
            await prisma.lattesParticipacaoBancaDeTrabalho.findMany({
              where: {
                professorId,
              },
              include: {
                bancaDeTrabalho: true,
              },
            });

          vinculos.forEach((v) => {
            if (
              !overlapsYearsOngoing(
                v.anoInicio,
                v.anoFim,
                query.yearStart,
                query.yearEnd,
              )
            )
              return;
            if (v.tipoVinculoAtuacaoProfissional.includes('Revisor de peri')) {
              revPeriodico.push(v);
            }
            if (
              v.tipoVinculoAtuacaoProfissional.includes(
                'Membro de corpo editorial',
              )
            ) {
              corpEditorial.push(v);
            }
          });
          eventosProfessor.forEach((p) => {
            if (!compYears(p.evento.anoEvento)) return;
            if (p.organizador) {
              organizacaoEvento.push(p);
              if (
                isComitePrograma({ titulo: p.titulo }) ||
                isComitePrograma({ titulo: p.titulo, alvo: 'program committe' })
              ) {
                orgComitePrograma.push(p);
              }
            } else {
              participacaoEvento.push(p);

              if (
                isComitePrograma({ titulo: p.titulo }) ||
                isComitePrograma({ titulo: p.titulo, alvo: 'program committe' })
              ) {
                comiteTrabalho.push(p);
              }
            }
          });
          formacaoProfessor.forEach((formacao) => {
            if (formacao.tipoFormacao === 'MESTRADO') {
              hasMestrado = true;
            }
            if (formacao.tipoFormacao === 'DOUTORADO') {
              hasDoutorado = true;
            }
            if (formacao.tipoFormacao === 'POS_DOUTORADO') {
              hasPos = true;
            }
          });

          bancasTrabalho.forEach((bancaRel) => {
            if (
              !compYears(
                bancaRel.bancaDeTrabalho.anoBancaDeTrabalho,
                query.yearStart,
                query.yearEnd,
              )
            )
              return;
            const tipoRaw =
              bancaRel?.bancaDeTrabalho?.tipoBancaDeTrabalho ?? '';
            const tipo = String(tipoRaw).toUpperCase();

            if (tipo.includes('MESTRADO')) {
              bancas.mestrado.push(bancaRel);
              return;
            }

            if (tipo.includes('DOUTORADO')) {
              bancas.doutorado.push(bancaRel);
              return;
            }

            // QUALIFICACAO / EXAME_QUALIFICACAO / QUALIFICAÇÃO (se vier com acento)
            if (
              tipo.includes('QUALIFICACAO') ||
              tipo.includes('QUALIFICA') || // cobre QUALIFICAÇÃO/QUALIFICACAO
              tipo.includes('EXAME_QUALIFICACAO')
            ) {
              bancas.qualificacao.push(bancaRel);
              return;
            }

            if (tipo.includes('GRADUACAO')) {
              bancas.graduacao.push(bancaRel);
              return;
            }

            bancas.outras.push(bancaRel);
          });
          dataAtualizacao = new Date(
            p.LattesProfessor.dataUltimaAtualizacaoCurriculo,
          );
          dataAtualizacaoFormatted = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(dataAtualizacao);
        } else {
          dataAtualizacao = null;
        }

        return {
          id: p.id,
          nome: p.nomeCompleto,
          ultimaAtualizacao: p.ultimaAtualizacao,
          projetos,
          publicacoes,
          orientacoes,
          premios,
          status,
          dataAtualizacao,
          dataAtualizacaoFormatted,
          hasMestrado,
          hasDoutorado,
          hasPos,
          bancas,
          corpEditorial,
          participacaoEvento,
          organizacaoEvento,
          revPeriodico,
          idLattes,
          comiteTrabalho,
          orgComitePrograma,
        };
      }),
    );

    const numberProfessors = professores.length;
    const numberUpdated = professorsData.filter(
      (p) => p.status === LattesStatus.ATUALIZADO,
    ).length;
    const numberStale = professores.filter(
      (p) => p.ultimaAtualizacao && p.ultimaAtualizacao < staleLimit,
    ).length;
    const numberNoRecords = professores.filter(
      (p) => !p.ultimaAtualizacao,
    ).length;

    return {
      numberProfessors,
      numberUpdated,
      numberStale,
      numberNoRecords,
      professores: professorsData,
    };
  }

  async uploadParticipacaoEventos(
    dadosComplementares: any,
    professorId: number,
    tx: any,
  ) {
    const bloco = dadosComplementares?.['PARTICIPACAO-EM-EVENTOS-CONGRESSOS'];
    if (!bloco) return;
    // Tags possíveis dentro do bloco
    const TAGS = [
      'PARTICIPACAO-EM-CONGRESSO',
      'PARTICIPACAO-EM-FEIRA',
      'PARTICIPACAO-EM-SEMINARIO',
      'PARTICIPACAO-EM-SIMPOSIO',
      'PARTICIPACAO-EM-OFICINA',
      'PARTICIPACAO-EM-ENCONTRO',
      'PARTICIPACAO-EM-EXPOSICAO',
      'PARTICIPACAO-EM-OLIMPIADA',
      'OUTRAS-PARTICIPACOES-EM-EVENTOS-CONGRESSOS',
    ] as const;
    // console.log(bloco);
    // Monta lista flat de participações com “tipo” (pra natureza fallback)
    const items: Array<{ tag: string; item: any }> = [];
    for (const tag of TAGS) {
      for (const item of toArray<any>(bloco[tag])) {
        items.push({ tag, item });
      }
    }

    // 1) Remove todas participações do professor (sync)
    await tx.lattesParticipacaoEvento.deleteMany({
      where: { professorId, organizador: false },
    });

    // 2) Remove eventos órfãos (sem nenhuma participação)
    // (após o delete acima podem sobrar órfãos)
    const orfas = await tx.lattesEvento.findMany({
      where: { LattesParticipacaoEvento: { none: {} } },
      select: { eventoId: true },
    });
    if (orfas.length) {
      await tx.lattesEvento.deleteMany({
        where: { eventoId: { in: orfas.map((o) => o.eventoId) } },
      });
    }

    // 3) Insere novamente
    for (const { tag, item } of items) {
      // pega os blocos básicos/detalhamento independente do tipo
      const dadosBasicos = getChildByPrefix(item, 'DADOS-BASICOS') ?? {};
      const detalhamento = getChildByPrefix(item, 'DETALHAMENTO') ?? {};
      const anoEvento = Number(dadosBasicos?.['ANO']);
      if (!Number.isFinite(anoEvento) || anoEvento <= 0) continue;

      // Nome do evento: no detalhamento geralmente vem NOME-DO-EVENTO
      const nomeEvento =
        pickFirst(detalhamento, ['NOME-DO-EVENTO', 'NOME-DO-EVENTO-INGLES']) ??
        pickFirst(dadosBasicos, ['TITULO', 'TITULO-INGLES']) ??
        null;
      const tituloParticipacao = pickFirst(dadosBasicos, [
        'TITULO',
        'TITULO-INGLES',
      ]);

      const paisEvento =
        pickFirst(dadosBasicos, ['PAIS']) ??
        pickFirst(detalhamento, ['PAIS']) ??
        null;

      const cidadeEvento =
        pickFirst(detalhamento, ['CIDADE-DO-EVENTO']) ??
        pickFirst(detalhamento, ['CIDADE']) ??
        null;

      const naturezaEvento = pickFirst(dadosBasicos, ['NATUREZA']) ?? tag; // fallback: usa o “tipo” do XML
      // ufEvento: nem sempre vem explícito; se você tiver, mapeie aqui
      const ufEvento = pickFirst(detalhamento, ['UF-DO-EVENTO', 'UF']) ?? null;

      // --- Dedup: tenta achar um evento equivalente no banco ---
      // (como não existe unique, a gente usa findFirst com campos normalizados)
      const nomeN = norm(nomeEvento);
      const cidadeN = norm(cidadeEvento);
      const paisN = norm(paisEvento);

      const candidatos = await tx.lattesEvento.findMany({
        where: { anoEvento },
        select: {
          eventoId: true,
          nomeEvento: true,
          cidadeEvento: true,
          paisEvento: true,
        },
      });

      let eventoId: number | null = null;

      // critério simples e seguro: mesmo ano + nome + cidade (quando houver)
      const found = candidatos.find((c) => {
        if (norm(c.nomeEvento) !== nomeN) return false;
        if (cidadeN && norm(c.cidadeEvento) !== cidadeN) return false;
        if (paisN && norm(c.paisEvento) !== paisN) return false;
        // local pode variar; se vier no XML, tenta bater também
        return true;
      });

      if (found) {
        eventoId = found.eventoId;
      } else {
        const created = await tx.lattesEvento.create({
          data: {
            nomeEvento,
            anoEvento,
            paisEvento,
            ufEvento,
            cidadeEvento,
            naturezaEvento,
          },
          select: { eventoId: true },
        });
        eventoId = created.eventoId;
      }

      // --- Upsert na participação (PK composta @@id([eventoId, professorId])) ---
      const organizador = false;

      await tx.lattesParticipacaoEvento.upsert({
        where: {
          eventoId_professorId: { eventoId, professorId },
        },
        create: {
          eventoId,
          professorId,
          organizador,
          titulo: tituloParticipacao,
        },
        update: {
          organizador,
        },
      });

      // Observação: você também tem tabelas de ligação com Áreas/Palavras-chave,
      // mas você não passou os models delas. Quando quiser, eu encaixo:
      // - PALAVRAS-CHAVE -> LattesParticipacaoEventoPalavraChave
      // - AREAS-DO-CONHECIMENTO -> LattesParticipacaoEventoAreaConhecimento
    }
  }
  async uploadOrganizacaoEventos(
    curriculoVitae: any,
    professorId: number,
    tx: any,
  ) {
    const producaoTecnica = curriculoVitae?.['PRODUCAO-TECNICA'];
    if (!producaoTecnica) return;

    const demaisProducoes =
      producaoTecnica?.['DEMAIS-TIPOS-DE-PRODUCAO-TECNICA'];
    if (!demaisProducoes) return;

    const bloco = demaisProducoes?.['ORGANIZACAO-DE-EVENTO'];
    if (!bloco) return;

    // ORG pode vir como array (vários) ou objeto (um)
    const itens = toArray<any>(bloco);

    // 1) remove participações de organização (vamos remover todas organizador=true desse professor)
    await tx.lattesParticipacaoEvento.deleteMany({
      where: { professorId, organizador: true },
    });

    // 2) apaga eventos órfãos (sem nenhuma participação)
    const orfas = await tx.lattesEvento.findMany({
      where: { LattesParticipacaoEvento: { none: {} } },
      select: { eventoId: true },
    });
    if (orfas.length) {
      await tx.lattesEvento.deleteMany({
        where: { eventoId: { in: orfas.map((o) => o.eventoId) } },
      });
    }

    // 3) insere novamente
    for (const item of itens) {
      const dadosBasicos =
        item?.['DADOS-BASICOS-DA-ORGANIZACAO-DE-EVENTO'] ??
        getChildByPrefix(item, 'DADOS-BASICOS-DA-ORGANIZACAO-DE-EVENTO') ??
        {};

      const detalhamento =
        item?.['DETALHAMENTO-DA-ORGANIZACAO-DE-EVENTO'] ??
        getChildByPrefix(item, 'DETALHAMENTO-DA-ORGANIZACAO-DE-EVENTO') ??
        {};

      const anoEvento = Number(dadosBasicos?.['ANO']);
      if (!Number.isFinite(anoEvento) || anoEvento <= 0) continue;

      // Nome do evento: normalmente TITULO
      const nomeEvento =
        dadosBasicos?.['TITULO'] ?? dadosBasicos?.['TITULO-INGLES'] ?? null;

      const paisEvento = dadosBasicos?.['PAIS'] ?? null;
      const cidadeEvento = detalhamento?.['CIDADE'] ?? null;

      // Aqui faz sentido salvar "naturezaEvento" como NATUREZA (ORGANIZACAO/CURADORIA/etc)
      // e opcionalmente “tipo” no nome (se quiser). Mantive simples.
      const naturezaEvento = dadosBasicos?.['NATUREZA'] ?? 'ORGANIZACAO';

      const ufEvento = null; // não vem nesse bloco

      // --- Dedup evento no mesmo ano: nome + cidade/pais/local quando existirem ---
      const nomeN = norm(nomeEvento);
      if (!nomeN) continue;

      const cidadeN = norm(cidadeEvento);
      const paisN = norm(paisEvento);

      const candidatos = await tx.lattesEvento.findMany({
        where: { anoEvento },
        select: {
          eventoId: true,
          nomeEvento: true,
          cidadeEvento: true,
          paisEvento: true,
        },
      });

      const found = candidatos.find((c) => {
        if (norm(c.nomeEvento) !== nomeN) return false;
        if (cidadeN && norm(c.cidadeEvento) !== cidadeN) return false;
        if (paisN && norm(c.paisEvento) !== paisN) return false;
        return true;
      });

      let eventoId: number;
      if (found) {
        eventoId = found.eventoId;
      } else {
        const created = await tx.lattesEvento.create({
          data: {
            nomeEvento,
            anoEvento,
            paisEvento,
            ufEvento,
            cidadeEvento,
            naturezaEvento,
          },
          select: { eventoId: true },
        });
        eventoId = created.eventoId;
      }

      // --- Participação como organizador ---
      await tx.lattesParticipacaoEvento.upsert({
        where: {
          eventoId_professorId: { eventoId, professorId },
        },
        create: {
          eventoId,
          professorId,
          organizador: true,
          titulo: nomeEvento,
        },
        update: {
          organizador: true,
        },
      });
    }
  }

  async importarLattes(filePath: string, usuarioId: number) {
    try {
      const xml = await fs.readFile(filePath, 'utf-8');

      const json = xml2json.toJson(xml, {
        object: true,
        trim: true,
        sanitize: false,
        coerce: false,
      });

      const curriculo = json['CURRICULO-VITAE'];
      const dadosComplementares = curriculo['DADOS-COMPLEMENTARES'];

      if (!curriculo) {
        throw new Error('XML inválido: CURRICULO-VITAE não encontrado');
      }

      const professorDto = getDadosProfessor(curriculo);
      const premios = getPremiosTitulos(curriculo);
      const formacoes = getFormacaoAcademicaTitulacao(curriculo);
      const { instituicoes, atividades, vinculos } =
        getAtuacoesProfissionais(curriculo);

      // 🔥 Mapa: sequenciaAtividade -> codigoInstituicao
      const atuacoesXml = toArray(
        curriculo?.['DADOS-GERAIS']?.['ATUACOES-PROFISSIONAIS']?.[
          'ATUACAO-PROFISSIONAL'
        ],
      );

      const codigoPorSequencia = new Map<number, string | undefined>();
      for (const a of atuacoesXml) {
        const seq = Number(a?.['SEQUENCIA-ATIVIDADE']);
        const cod = a?.['CODIGO-INSTITUICAO'];
        if (!Number.isNaN(seq)) codigoPorSequencia.set(seq, cod);
      }

      await prisma.$transaction(async (tx) => {
        // 1) Upsert do professor
        const lattesProfessor = await tx.lattesProfessor.upsert({
          where: { usuarioId },
          update: professorDto,
          create: {
            usuarioId,
            dataUltimaPublicacaoCurriculo: parseLattesDateTime(
              curriculo['DATA-ATUALIZACAO'],
              curriculo['HORA-ATUALIZACAO'],
            ),
            linkParaCurriculo: '',
            ...professorDto,
          },
        });

        const professorId = lattesProfessor.professorId;
        await uploadBancas(dadosComplementares, professorId, tx);
        await this.uploadParticipacaoEventos(
          dadosComplementares,
          professorId,
          tx,
        );
        await this.uploadOrganizacaoEventos(curriculo, professorId, tx);

        // 2) Limpa dados antigos (ordem por FK)
        await tx.lattesPremioOuTitulo.deleteMany({ where: { professorId } });
        await tx.lattesVinculoAtuacaoProfissional.deleteMany({
          where: { professorId },
        });
        await tx.lattesAtividadeProfissional.deleteMany({
          where: { professorId },
        });

        // 🔥 2.5) Limpa formações antigas
        await tx.lattesFormacaoAcademicaTitulacao.deleteMany({
          where: { professorId },
        });

        // 🔥 2.6) Insere formações (reimport total)
        for (const f of formacoes) {
          await tx.lattesFormacaoAcademicaTitulacao.upsert({
            where: {
              professorId_sequenciaFormacaoAcademica: {
                professorId,
                sequenciaFormacaoAcademica: f.sequenciaFormacaoAcademica,
              },
            },
            update: {
              tipoFormacao: f.tipoFormacao,
              nivelFormacaoAcademica: f.nivelFormacaoAcademica ?? null,
              codigoCurso: f.codigoCurso ?? null,
              nomeCurso: f.nomeCurso ?? null,

              codigoInstituicaoEmpresa: f.codigoInstituicaoEmpresa ?? null,
              nomeInstituicaoEmpresa: f.nomeInstituicaoEmpresa ?? null,

              statusDoCurso: f.statusDoCurso ?? null,
              anoInicio: f.anoInicio ?? null,
              anoConclusao: f.anoConclusao ?? null,
              anoObtencaoTitulo: f.anoObtencaoTitulo ?? null,

              tituloTrabalhoConclusaoCurso:
                f.tituloTrabalhoConclusaoCurso ?? null,
              nomeOrientador: f.nomeOrientador ?? null,

              tipoBolsa: (f as any).tipoBolsa ?? null, // se você adicionar no DTO, tira esse any
              codigoAgenciaFinanciadora: f.codigoAgenciaFinanciadora ?? null,
              nomeAgenciaFinanciadora: f.nomeAgenciaFinanciadora ?? null,

              // Se você quiser preencher essas colunas textuais quando existirem no XML
              // (e incluir no DTO depois), deixe aqui:
              // codigoInstituicaoEmpresaOutra: f.codigoInstituicaoEmpresaOutra ?? null,
              // nomeInstituicaoEmpresaOutra: f.nomeInstituicaoEmpresaOutra ?? null,
              // codigoOrgaoInstituicaoEmpresa: f.codigoOrgaoInstituicaoEmpresa ?? null,
              // nomeOrgaoInstituicaoEmpresa: f.nomeOrgaoInstituicaoEmpresa ?? null,
              // codigoUnidadeInstituicaoEmpresa: f.codigoUnidadeInstituicaoEmpresa ?? null,
              // nomeUnidadeInstituicaoEmpresa: f.nomeUnidadeInstituicaoEmpresa ?? null,

              // FKs ficam null por enquanto (normalização opcional depois)
              cursoId: null,
              instituicaoEmpresaId: null,
              orgaoInstituicaoEmpresaId: null,
              unidadeInstituicaoEmpresaId: null,
              orientadorId: null,
              agenciaFinanciadoraId: null,
            },
            create: {
              professorId,
              sequenciaFormacaoAcademica: f.sequenciaFormacaoAcademica,

              tipoFormacao: f.tipoFormacao,
              nivelFormacaoAcademica: f.nivelFormacaoAcademica ?? null,
              codigoCurso: f.codigoCurso ?? null,
              nomeCurso: f.nomeCurso ?? null,

              codigoInstituicaoEmpresa: f.codigoInstituicaoEmpresa ?? null,
              nomeInstituicaoEmpresa: f.nomeInstituicaoEmpresa ?? null,

              statusDoCurso: f.statusDoCurso ?? null,
              anoInicio: f.anoInicio ?? null,
              anoConclusao: f.anoConclusao ?? null,
              anoObtencaoTitulo: f.anoObtencaoTitulo ?? null,

              tituloTrabalhoConclusaoCurso:
                f.tituloTrabalhoConclusaoCurso ?? null,
              nomeOrientador: f.nomeOrientador ?? null,

              tipoBolsa: (f as any).tipoBolsa ?? null,
              codigoAgenciaFinanciadora: f.codigoAgenciaFinanciadora ?? null,
              nomeAgenciaFinanciadora: f.nomeAgenciaFinanciadora ?? null,

              cursoId: null,
              instituicaoEmpresaId: null,
              orgaoInstituicaoEmpresaId: null,
              unidadeInstituicaoEmpresaId: null,
              orientadorId: null,
              agenciaFinanciadoraId: null,
            },
          });
        }

        // 3) Upsert/criação de instituições (sem quebrar quando código é null)
        const instituicoesCriadas = new Map<string, number>();

        for (const inst of instituicoes) {
          const codigo = inst.codigoInstituicaoEmpresa?.trim();
          const nome = inst.nomeInstituicaoEmpresa?.trim();

          // Se tiver código, dá pra usar upsert (unique)
          if (codigo) {
            const instituicao = await tx.lattesInstituicaoEmpresa.upsert({
              where: { codigoInstituicaoEmpresa: codigo },
              update: {
                // se quiser atualizar nome quando vier vazio no banco:
                ...(nome ? { nomeInstituicaoEmpresa: nome } : {}),
              },
              create: {
                codigoInstituicaoEmpresa: codigo,
                nomeInstituicaoEmpresa: nome ?? null,
              },
            });
            instituicoesCriadas.set(codigo, instituicao.instituicaoEmpresaId);
            continue;
          }

          // Sem código: tenta reusar por nome (evita duplicar um pouco)
          if (nome) {
            const existente = await tx.lattesInstituicaoEmpresa.findFirst({
              where: { nomeInstituicaoEmpresa: nome },
              select: { instituicaoEmpresaId: true },
            });

            if (existente) {
              // chave de fallback por nome
              instituicoesCriadas.set(
                `__NOME__:${nome}`,
                existente.instituicaoEmpresaId,
              );
            } else {
              const criada = await tx.lattesInstituicaoEmpresa.create({
                data: {
                  codigoInstituicaoEmpresa: null,
                  nomeInstituicaoEmpresa: nome,
                },
                select: { instituicaoEmpresaId: true },
              });
              instituicoesCriadas.set(
                `__NOME__:${nome}`,
                criada.instituicaoEmpresaId,
              );
            }
          }
        }

        // 4) Criar atividades com FK correta
        for (const atividade of atividades) {
          const seq = atividade.sequenciaAtividadeProfissional;
          const codigo = codigoPorSequencia.get(seq)?.trim();

          // resolve instituicaoEmpresaId:
          let instituicaoEmpresaId: number | undefined;

          if (codigo) {
            instituicaoEmpresaId = instituicoesCriadas.get(codigo);
          } else {
            // fallback por nome (se existir no XML)
            const nome = atuacoesXml
              .find((a: any) => Number(a?.['SEQUENCIA-ATIVIDADE']) === seq)
              ?.['NOME-INSTITUICAO']?.trim();

            if (nome) {
              instituicaoEmpresaId = instituicoesCriadas.get(
                `__NOME__:${nome}`,
              );
            }
          }

          // Se ainda não achou, você pode:
          // - lançar erro (mais rígido)
          // - ou criar uma instituição "desconhecida" (mais permissivo)
          if (!instituicaoEmpresaId) {
            // modo rígido:
            // throw new Error(`Instituição não resolvida para atividade seq=${seq}`)

            // modo permissivo (recomendado pra não travar import):
            const criada = await tx.lattesInstituicaoEmpresa.create({
              data: {
                codigoInstituicaoEmpresa: codigo ?? null,
                nomeInstituicaoEmpresa:
                  atuacoesXml.find(
                    (a: any) => Number(a?.['SEQUENCIA-ATIVIDADE']) === seq,
                  )?.['NOME-INSTITUICAO'] ?? null,
              },
              select: { instituicaoEmpresaId: true },
            });
            instituicaoEmpresaId = criada.instituicaoEmpresaId;
            if (codigo) instituicoesCriadas.set(codigo, instituicaoEmpresaId);
          }

          await tx.lattesAtividadeProfissional.create({
            data: {
              professorId,
              sequenciaAtividadeProfissional: seq,
              instituicaoEmpresaId,
            },
          });
        }

        // 5) Criar vínculos (depende de professorId e sequenciaAtividadeProfissional)
        if (vinculos.length) {
          await tx.lattesVinculoAtuacaoProfissional.createMany({
            data: vinculos.map((v) => ({
              ...v,
              professorId,
            })),
            skipDuplicates: true, // ajuda se o XML tiver repetição
          });
        }

        // 6) Criar prêmios (pode ser createMany)
        if (premios.length) {
          await tx.lattesPremioOuTitulo.createMany({
            data: premios.map((p) => ({
              professorId,
              anoPremioOuTitulo: p.anoPremioOuTitulo,
              nomeEntidadePromotora: p.nomeEntidadePromotora ?? null,
              nomePremioOuTitulo: p.nomePremioOuTitulo ?? null,
            })),
          });
        }
      });

      return { sucesso: true, message: 'Currículo importado com sucesso' };
    } catch (error) {
      console.error('Erro ao importar Lattes:', error);
      throw new Error('Erro ao importar currículo Lattes');
    }
  }

  async reprocessarTodosOsXmls(opts: { concurrency?: number } = {}) {
    const concurrency = opts.concurrency ?? 2;

    const baseDir = path.join(process.cwd(), 'uploads', 'usuario');

    // lista pastas /uploads/usuario/{id}
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const userDirs = entries.filter((e) => e.isDirectory());

    // monta jobs { usuarioId, filePath }
    const jobs: Array<{ usuarioId: number; filePath: string }> = [];

    for (const dir of userDirs) {
      const usuarioId = Number(dir.name);
      if (!Number.isFinite(usuarioId)) continue;

      const filePath = path.join(baseDir, dir.name, 'curriculoXML.xml');
      try {
        await fs.access(filePath);
        jobs.push({ usuarioId, filePath });
      } catch {
        // sem arquivo, ignora
      }
    }

    // pool simples de concorrência
    const results: Array<
      | { usuarioId: number; filePath: string; ok: true }
      | { usuarioId: number; filePath: string; ok: false; error: string }
    > = [];

    let idx = 0;
    const worker = async () => {
      while (idx < jobs.length) {
        const current = jobs[idx++];
        try {
          const resultado = await getCompleteFormDataFromFile(current.filePath);
          await PublicacaoService.adicionarVarios(
            current.usuarioId,
            resultado.publicacoes as ProjetoParsed[],
          );
          await ProjetoService.adicionarVarios(
            current.usuarioId,
            resultado.projetos as any,
          );
          await this.importarLattes(current.filePath, current.usuarioId);
          results.push({ ...current, ok: true });
        } catch (e: any) {
          results.push({
            ...current,
            ok: false,
            error: e?.message ?? String(e),
          });
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(concurrency, jobs.length) }, worker),
    );

    const ok = results.filter((r) => r.ok).length;
    const fail = results.length - ok;

    return {
      scannedFolders: userDirs.length,
      foundXmls: jobs.length,
      processed: results.length,
      ok,
      fail,
      errors: results.filter((r) => !r.ok),
    };
  }
}

export default new CurriculoService();
