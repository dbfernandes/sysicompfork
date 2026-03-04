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

      const professorDto = getDadosProfessor(curriculo);
      const { instituicoes, atividades, vinculos } =
        getAtuacoesProfissionais(curriculo);

      await prisma.$transaction(async (tx) => {
        // 🔥 1️⃣ Upsert do professor
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

        // 🔥 2️⃣ Limpa dados antigos
        await tx.lattesVinculoAtuacaoProfissional.deleteMany({
          where: { professorId },
        });

        await tx.lattesAtividadeProfissional.deleteMany({
          where: { professorId },
        });

        // 🔥 3️⃣ Criar instituições (sem duplicar)
        const instituicoesCriadas: Record<string, number> = {};

        for (const inst of instituicoes) {
          const instituicao = await tx.lattesInstituicaoEmpresa.upsert({
            where: {
              codigoInstituicaoEmpresa: inst.codigoInstituicaoEmpresa,
            },
            update: {},
            create: inst,
          });

          instituicoesCriadas[inst.codigoInstituicaoEmpresa] =
            instituicao.instituicaoEmpresaId;
        }

        // 🔥 4️⃣ Criar atividades com FK correta
        const atividadesCriadas = [];

        for (const atividade of atividades) {
          const codigo = curriculo['DADOS-GERAIS']?.[
            'ATUACOES-PROFISSIONAIS'
          ]?.['ATUACAO-PROFISSIONAL']?.find(
            (a: any) =>
              Number(a['SEQUENCIA-ATIVIDADE']) ===
              atividade.sequenciaAtividadeProfissional,
          )?.['CODIGO-INSTITUICAO'];

          const instituicaoEmpresaId = instituicoesCriadas[codigo];

          const atividadeCriada = await tx.lattesAtividadeProfissional.create({
            data: {
              professorId,
              sequenciaAtividadeProfissional:
                atividade.sequenciaAtividadeProfissional,
              instituicaoEmpresaId,
            },
          });

          atividadesCriadas.push(atividadeCriada);
        }

        // 🔥 5️⃣ Criar vínculos
        await tx.lattesVinculoAtuacaoProfissional.createMany({
          data: vinculos.map((v) => ({
            ...v,
            professorId,
          })),
        });
      });

      return {
        sucesso: true,
        message: 'Currículo importado com sucesso',
      };
    } catch (error) {
      console.error('Erro ao importar Lattes:', error);
      throw new Error('Erro ao importar currículo Lattes');
    }
  }
}

export default new CurriculoService();
