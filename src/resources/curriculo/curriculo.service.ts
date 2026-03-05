import prisma from '@client/prismaClient';
import xml2json from 'xml2json';
import fs from 'fs/promises';

import {
  getAtuacoesProfissionais,
  getDadosProfessor,
  getFormacaoAcademicaTitulacao,
  getPremiosTitulos,
} from '@resources/curriculo/teste';

enum LattesStatus {
  ATUALIZADO = 'ATUALIZADO',
  DESATUALIZADO = 'DESATUALIZADO',
  SEM_REGISTROS = 'SEM_REGISTROS',
}

export type LattesRowDTO = {
  id: number;
  nome: string;
  ultimaAtualizacao: Date | null;
  projetos: number;
  publicacoes: number;
  orientacoes: number;
  premios: number;
  status: LattesStatus;
};

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toYearRange(from: Date, to: Date) {
  return { fromYear: from.getFullYear(), toYear: to.getFullYear() };
}
// se você já tem isso em outro lugar, reaproveite
function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

class CurriculoService {
  async getAcompanhamentoLattes() {
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
              },
            },
          },
        },
        projetos: {
          select: {
            dataInicio: true,
            dataFim: true,
          },
        },
        orientacoes: {
          select: {
            tipo: true,
            ano: true,
          },
        },
        premios: {
          select: { id: true, updatedAt: true, ano: true },
        },
      },
    });
    const professorsData: any[] = professores.map((p) => {
      const publicacoes = p.publicacoes.map((p) => ({
        ano: p.publicacao.ano,
        tipo: p.publicacao.tipoId,
      }));
      const projetos = p.projetos;
      const orientacoes = p.orientacoes;
      const premios = p.premios;
      const status: LattesStatus = !p.ultimaAtualizacao
        ? LattesStatus.SEM_REGISTROS
        : p.ultimaAtualizacao < staleLimit
          ? LattesStatus.DESATUALIZADO
          : LattesStatus.ATUALIZADO;

      return {
        id: p.id,
        nome: p.nomeCompleto,
        ultimaAtualizacao: p.ultimaAtualizacao,
        projetos,
        publicacoes,
        orientacoes,
        premios,
        status,
      };
    });

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
            dataUltimaPublicacaoCurriculo: new Date(),
            linkParaCurriculo: '',
            ...professorDto,
          },
        });

        const professorId = lattesProfessor.professorId;

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
}

export default new CurriculoService();
