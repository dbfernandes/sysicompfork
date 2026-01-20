import prisma from '@client/prismaClient';

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
}

export default new CurriculoService();
