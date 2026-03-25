import {
  DefesaModalidade,
  DefesaNivel,
  DefesaStatus,
  DefesaTipo,
  Prisma,
  PrismaClient,
  VinculoMembro,
} from '@prisma/client';
import {
  DefesaInitDto,
  DefesaListItem,
  FinalStep1Dto,
  FinalStep2Dto,
  FinalStep3Dto,
  FinalStep4Dto,
  FinalStep5Dto,
  FinalStep6Dto,
  ListarParams,
  MembroInput,
  QualiStep1Dto,
  QualiStep2Dto,
  QualiStep3Dto,
  QualiStep4Dto,
  QualiStep5Dto,
  QualiStep6Dto,
  QualiStep7Dto,
} from './defesa.types';
import {
  defesaInitSchema,
  finalStep1Schema,
  finalStep2Schema,
  finalStep3Schema,
  finalStep4Schema,
  finalStep5Schema,
  finalStep6Schema,
  qualiStep2Schema,
  qualiStep3Schema,
  qualiStep4Schema,
  qualiStep5Schema,
  qualiStep6Schema,
  qualiStep7Schema,
} from './defesa.schema';

const prisma = new PrismaClient();

async function replaceMembros(
  tx: Prisma.TransactionClient,
  defesaId: string,
  opts: {
    titulares?: MembroInput[];
    suplentes?: MembroInput[];
    manterPresidente?: boolean;
  },
) {
  if (opts.titulares) {
    await tx.membroBanca.deleteMany({
      where: {
        defesaId,
        suplente: false,
        ...(opts.manterPresidente ? { NOT: { papel: 'PRESIDENTE' } } : {}),
      },
    });
    for (const m of opts.titulares) {
      await tx.membroBanca.create({
        data: {
          defesaId,
          nome: m.nome,
          email: m.email ?? null,
          instituicao: m.instituicao ?? null,
          vinculo: (m.vinculo ?? 'EXTERNO') as VinculoMembro,
          papel: 'MEMBRO',
          suplente: false,
        },
      });
    }
  }
  if (opts.suplentes) {
    await tx.membroBanca.deleteMany({ where: { defesaId, suplente: true } });
    for (const s of opts.suplentes) {
      await tx.membroBanca.create({
        data: {
          defesaId,
          nome: s.nome,
          email: s.email ?? null,
          instituicao: s.instituicao ?? null,
          vinculo: (s.vinculo ?? 'EXTERNO') as VinculoMembro,
          papel: 'MEMBRO',
          suplente: true,
        },
      });
    }
  }
}

function buildWhere(
  params: ListarParams & { orientadorId?: number } = {},
): Prisma.DefesaWhereInput {
  const where: Prisma.DefesaWhereInput = {};
  if (params.status) where.status = params.status;
  if (params.tipo) where.tipo = params.tipo;
  if (params.nivel) where.nivel = params.nivel;

  if (params.orientadorId) {
    where.orientadorId = params.orientadorId;
  }

  return where;
}

function mapListItem(row: any): DefesaListItem {
  return {
    id: row.id,
    candidatoNome:
      row.candidatoNome ??
      row.candidato?.nomeCompleto ??
      row.candidato?.nome ??
      '—',
    titulo: row.tituloTrabalho ?? '—',
    tipo: row.tipo as DefesaTipo,
    nivel: row.nivel as DefesaNivel,
    modalidade: (row.modalidade ?? null) as DefesaModalidade | null,
    dataHora: row.dataHora ? row.dataHora.toISOString() : '',
    localOuLink: row.localOuLink ?? '',
    status: row.status as DefesaStatus,
  };
}

export const DefesaService = {
  async buscarPorId(defesaId: string) {
    const defesa = await prisma.defesa.findUnique({
      where: { id: defesaId },
      include: {
        quali: true,
        final: true,
        orientador: true,
        coorientador: true,
        candidato: true,
        linhaPesquisa: true,
        membros: { orderBy: { createdAt: 'asc' } },
        uploads: true,
      },
    });
    if (!defesa) throw new Error('Defesa não encontrada.');
    return defesa;
  },

  async excluir(id: string) {
    return prisma.defesa.delete({ where: { id } });
  },

  async createInit(dto: DefesaInitDto, userId: number) {
    const { error, value } = defesaInitSchema.validate(dto, {
      abortEarly: false,
    });
    if (error) throw new Error(error.details.map((d) => d.message).join('; '));

    const criador = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    let orientadorId = null;
    if (criador && criador.professor === 1) {
      orientadorId = criador.id;
    }

    const created = await prisma.defesa.create({
      data: {
        tipo: value.tipo,
        nivel: value.nivel,
        status: 'RASCUNHO',
        criadoPorId: userId,
        orientadorId: orientadorId,
      },
    });
    return created;
  },

  // ========= updates parciais: QUALIFICAÇÃO =========
  async updateQualiStep1(defesaId: string, payload: QualiStep1Dto) {
    return prisma.defesa.update({
      where: { id: defesaId },
      data: {
        tituloTrabalho: payload.tituloTrabalho,
        candidatoNome: payload.candidatoNome,
        orientadorId: payload.orientadorId,
        coorientadorId: payload.coorientadorId,
        coorientadorExternoNome: payload.coorientadorExternoNome,
        coorientadorExternoInstituicao: payload.coorientadorExternoInstituicao,
        dataHora: payload.dataHora ? new Date(payload.dataHora) : undefined,
        modalidade: payload.modalidade,
      },
    });
  },

  async updateQualiStep2(defesaId: string, payload: QualiStep2Dto) {
    const { error, value } = qualiStep2Schema.validate(payload);
    if (error) throw new Error(error.message);

    return prisma.defesa.update({
      where: { id: defesaId },
      data: {
        localOuLink: value.localOuLink,
      },
    });
  },

  async updateQualiStep3(defesaId: string, payload: QualiStep3Dto) {
    const { error, value } = qualiStep3Schema.validate(payload);
    if (error) throw new Error(error.message);
    return prisma.qualificacaoExtra.upsert({
      where: { defesaId },
      create: {
        defesaId,
        resumoOuAbstract: value.resumoOuAbstract ?? '',
        palavrasChaves: value.palavrasChaves ?? '',
        creditosMinimosOk: value.creditosMinimosOk ?? false,
        presidenteOrigem: 'ORIENTADOR',
        autoavaliacaoPreenchida: false,
      },
      update: {
        resumoOuAbstract: value.resumoOuAbstract ?? undefined,
        palavrasChaves: value.palavrasChaves ?? undefined,
        creditosMinimosOk: value.creditosMinimosOk ?? undefined,
      },
    });
  },

  async updateQualiStep4(defesaId: string, payload: QualiStep4Dto) {
    const { error, value } = qualiStep4Schema.validate(payload);
    if (error) throw new Error(error.message);

    return prisma.$transaction(async (tx) => {
      if (value.presidenteOrigem) {
        await tx.qualificacaoExtra.upsert({
          where: { defesaId },
          create: {
            defesaId,
            resumoOuAbstract: '',
            palavrasChaves: '',
            creditosMinimosOk: false,
            presidenteOrigem: value.presidenteOrigem,
            autoavaliacaoPreenchida: false,
          },
          update: { presidenteOrigem: value.presidenteOrigem },
        });
        await tx.membroBanca.deleteMany({
          where: { defesaId, papel: 'PRESIDENTE' },
        });
        await tx.membroBanca.create({
          data: {
            defesaId,
            nome:
              value.presidenteOrigem === 'ORIENTADOR'
                ? 'Orientador(a)'
                : 'Coorientador(a)',
            instituicao: 'PPGI/ICOMP',
            papel: 'PRESIDENTE',
            vinculo: 'INTERNO',
            suplente: false,
          },
        });
      }
      return true;
    });
  },

  async updateQualiStep5(defesaId: string, payload: QualiStep5Dto) {
    const { error, value } = qualiStep5Schema.validate(payload);
    if (error) throw new Error(error.message);
    if (!value.membrosTitulares) return true;
    return prisma.$transaction((tx) =>
      replaceMembros(tx, defesaId, {
        titulares: value.membrosTitulares,
        manterPresidente: true,
      }),
    );
  },

  async updateQualiStep6(defesaId: string, payload: QualiStep6Dto) {
    const { error, value } = qualiStep6Schema.validate(payload);
    if (error) throw new Error(error.message);
    if (!value.suplentes) return true;
    return prisma.$transaction((tx) =>
      replaceMembros(tx, defesaId, { suplentes: value.suplentes }),
    );
  },

  async updateQualiStep7(defesaId: string, payload: QualiStep7Dto) {
    const { error, value } = qualiStep7Schema.validate(payload);
    if (error) throw new Error(error.message);
    return prisma.qualificacaoExtra.upsert({
      where: { defesaId },
      create: {
        defesaId,
        resumoOuAbstract: '',
        palavrasChaves: '',
        creditosMinimosOk: false,
        presidenteOrigem: 'ORIENTADOR',
        doutoradoArtigoComprovado: value.doutoradoArtigoComprovado ?? null,
        artigoTitulo: value.artigoTitulo ?? null,
        artigoVeiculoOuDoi: value.artigoVeiculoOuDoi ?? null,
        autoavaliacaoPreenchida: value.autoavaliacaoPreenchida ?? false,
      },
      update: {
        doutoradoArtigoComprovado: value.doutoradoArtigoComprovado ?? undefined,
        artigoTitulo: value.artigoTitulo ?? undefined,
        artigoVeiculoOuDoi: value.artigoVeiculoOuDoi ?? undefined,
        autoavaliacaoPreenchida: value.autoavaliacaoPreenchida ?? undefined,
      },
    });
  },

  // ========= updates parciais: DEFESA FINAL =========
  async updateFinalStep1(defesaId: string, payload: FinalStep1Dto) {
    const { error, value } = finalStep1Schema.validate(payload);
    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join('; ');
      throw new Error(errorMessages);
    }

    return prisma.defesa.update({
      where: { id: defesaId },
      data: {
        tituloTrabalho: value.tituloTrabalho,
        linhaPesquisaId: value.linhaPesquisaId
          ? parseInt(value.linhaPesquisaId)
          : null,
        candidatoNome: value.candidatoNome,
        orientadorId: value.orientadorId,
        dataHora: value.dataHora ? new Date(value.dataHora) : undefined,
        modalidade: value.modalidade,
        coorientadorId: undefined,
        coorientadorExternoNome: undefined,
        coorientadorExternoInstituicao: undefined,
      },
    });
  },

  async updateFinalStep2(defesaId: string, payload: FinalStep2Dto) {
    const { error, value } = finalStep2Schema.validate(payload);
    if (error) throw new Error(error.message);
    return prisma.defesa.update({
      where: { id: defesaId },
      data: { localOuLink: value.localOuLink ?? undefined },
    });
  },

  async updateFinalStep3(defesaId: string, payload: FinalStep3Dto) {
    const { error, value } = finalStep3Schema.validate(payload);
    if (error) {
      console.log(error);
    }

    return prisma.defesaFinalExtra.upsert({
      where: { defesaId },
      create: {
        defesaId,
        resumoPt: value.resumoPt ?? '',
        palavrasChavePt: value.palavrasChavePt ?? '',
        abstractEn: value.abstractEn ?? '',
        keywordsEn: value.keywordsEn ?? '',
        idiomaTese: value.idiomaTese ?? '',
        creditosOk: value.creditosOk ?? false,
        creditosExigidos: value.creditosExigidos,
        artigoEstratoSuperiorOk: false,
        artigoTitulo: '',
        artigoVeiculoOuDoi: '',
        incluiuAgradecimentosObrigatorios: false,
        autoavaliacaoPreenchida: false,
      },
      update: {
        resumoPt: value.resumoPt,
        palavrasChavePt: value.palavrasChavePt,
        abstractEn: value.abstractEn,
        keywordsEn: value.keywordsEn,
        idiomaTese: value.idiomaTese,
        creditosOk: value.creditosOk,
        creditosExigidos: value.creditosExigidos,
      },
    });
  },

  async updateFinalStep4(defesaId: string, payload: FinalStep4Dto) {
    const { error, value } = finalStep4Schema.validate(payload);
    if (error) throw new Error(error.message);
    if (!value.membrosTitulares) return true;
    return prisma.$transaction((tx) =>
      replaceMembros(tx, defesaId, { titulares: value.membrosTitulares }),
    );
  },

  async updateFinalStep5(defesaId: string, payload: FinalStep5Dto) {
    const { error, value } = finalStep5Schema.validate(payload);
    if (error) throw new Error(error.message);
    if (!value.suplentes) return true;
    return prisma.$transaction((tx) =>
      replaceMembros(tx, defesaId, { suplentes: value.suplentes }),
    );
  },

  async updateFinalStep6(defesaId: string, payload: FinalStep6Dto) {
    const { error, value } = finalStep6Schema.validate(payload);
    if (error) throw new Error(error.message);
    return prisma.defesaFinalExtra.upsert({
      where: { defesaId },
      create: {
        defesaId,
        resumoPt: '',
        palavrasChavePt: '',
        abstractEn: '',
        keywordsEn: '',
        idiomaTese: '',
        creditosOk: false,
        creditosExigidos: 16,
        artigoEstratoSuperiorOk: value.artigoEstratoSuperiorOk ?? false,
        artigoTitulo: value.artigoTitulo ?? '',
        artigoVeiculoOuDoi: value.artigoVeiculoOuDoi ?? '',
        incluiuAgradecimentosObrigatorios:
          value.incluiuAgradecimentosObrigatorios ?? false,
        textoAgradecimentos: value.textoAgradecimentos ?? null,
        autoavaliacaoPreenchida: value.autoavaliacaoPreenchida ?? false,
      },
      update: {
        artigoEstratoSuperiorOk: value.artigoEstratoSuperiorOk ?? undefined,
        artigoTitulo: value.artigoTitulo ?? undefined,
        artigoVeiculoOuDoi: value.artigoVeiculoOuDoi ?? undefined,
        incluiuAgradecimentosObrigatorios:
          value.incluiuAgradecimentosObrigatorios ?? undefined,
        textoAgradecimentos: value.textoAgradecimentos ?? undefined,
        autoavaliacaoPreenchida: value.autoavaliacaoPreenchida ?? undefined,
      },
    });
  },

  async saveUploadTese(defesaId: string, file: Express.Multer.File) {
    await prisma.defesaUpload.deleteMany({
      where: { defesaId, tipo: 'TESE_PDF' },
    });

    return prisma.defesaUpload.create({
      data: {
        defesaId,
        tipo: 'TESE_PDF',
        path: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  },

  async saveUpload(defesaId: string, file: Express.Multer.File) {
    await prisma.defesaUpload.deleteMany({
      where: { defesaId, tipo: 'PROPOSTA_PDF' },
    });

    return prisma.defesaUpload.create({
      data: {
        defesaId,
        tipo: 'PROPOSTA_PDF',
        path: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  },

  // ========= submissão (valida tudo e muda status) =========
  async validateAndSubmit(defesaId: string) {
    const d = await prisma.defesa.findUnique({
      where: { id: defesaId },
      include: {
        quali: true,
        final: true,
        membros: true,
      },
    });
    if (!d) throw new Error('Defesa não encontrada.');

    // regras de validação final
    if (d.tipo === 'QUALIFICACAO') {
      if (!d.tituloTrabalho || !d.dataHora || !d.modalidade)
        throw new Error('Preencha o passo 1 de Qualificação.');
      if (d.modalidade === 'PRESENCIAL' && !d.localOuLink)
        throw new Error('Informe o local da Qualificação.');
      if (d.modalidade === 'ONLINE' && !d.localOuLink)
        throw new Error('Informe o link da Qualificação.');

      if (!d.quali?.resumoOuAbstract || !d.quali?.palavrasChaves)
        throw new Error('Preencha o passo 3 (Resumo/Palavras-chave).');
      if (d.nivel === 'DOUTORADO' && d.quali?.doutoradoArtigoComprovado) {
        if (!d.quali.artigoTitulo || !d.quali.artigoVeiculoOuDoi)
          throw new Error('Informe os dados do artigo do doutorado.');
      }
      if (d.quali?.autoavaliacaoPreenchida !== true)
        throw new Error('Confirme a autoavaliação (Qualificação).');

      const pres = d.membros.find((m) => m.papel === 'PRESIDENTE');
      const titulares = d.membros.filter(
        (m) => !m.suplente && m.papel === 'MEMBRO',
      ).length;
      const suplentes = d.membros.filter((m) => m.suplente).length;
      if (!pres) throw new Error('Defina o presidente da banca.');
      if (titulares < 2)
        throw new Error(
          'Qualificação exige pelo menos dois membros além do presidente.',
        );
      if (suplentes < 2) throw new Error('Informe dois suplentes.');
    } else {
      if (
        !d.tituloTrabalho ||
        !d.dataHora ||
        !d.modalidade ||
        !d.linhaPesquisaId
      )
        throw new Error(
          'Preencha o passo 1 da Defesa Final (inclui Linha de Pesquisa).',
        );
      if (!d.localOuLink)
        throw new Error('Informe local ou link da Defesa Final.');

      if (
        !d.final?.resumoPt ||
        !d.final?.palavrasChavePt ||
        !d.final?.abstractEn ||
        !d.final?.keywordsEn ||
        !d.final?.idiomaTese
      )
        throw new Error('Preencha o passo 3 (resumo/abstract/idioma).');

      // if (d.nivel === 'MESTRADO' && d.final.creditosExigidos !== 16)
      //   throw new Error('Créditos do mestrado devem ser 16.');
      // if (d.nivel === 'DOUTORADO' && d.final.creditosExigidos !== 36)
      //   throw new Error('Créditos do doutorado devem ser 36.');
      // if (d.final.creditosOk !== true)
      //   throw new Error('Confirme os créditos (Defesa Final).');

      const titulares = d.membros.filter((m) => !m.suplente).length;
      const internos = d.membros.filter(
        (m) => !m.suplente && m.vinculo === 'INTERNO',
      ).length;
      const externos = d.membros.filter(
        (m) => !m.suplente && m.vinculo === 'EXTERNO',
      ).length;
      const suplentes = d.membros.filter((m) => m.suplente).length;

      if (d.nivel === 'MESTRADO' && titulares < 2)
        throw new Error('Mestrado exige 3 membros titulares.');
      if (d.nivel === 'DOUTORADO' && titulares < 3)
        throw new Error('Doutorado exige 4 membros titulares.');
      if (externos < internos) throw new Error('Regra: externos ≥ internos.');
      if (suplentes < 2) throw new Error('Informe dois suplentes.');

      if (d.final.artigoEstratoSuperiorOk !== true)
        throw new Error('Confirme o artigo (estrato superior).');
      if (!d.final.artigoTitulo || !d.final.artigoVeiculoOuDoi)
        throw new Error('Informe dados do artigo.');
      if (d.final.incluiuAgradecimentosObrigatorios !== true)
        throw new Error('Confirme os agradecimentos CAPES/FAPEAM.');
      if (d.final.autoavaliacaoPreenchida !== true)
        throw new Error('Confirme a autoavaliação (Defesa Final).');
    }
    await prisma.defesa.update({
      where: { id: defesaId },
      data: { status: 'AGUARDANDO_VALIDACAO' },
    });

    return true;
  },

  async updateStatus(defesaId: string, status: DefesaStatus) {
    return prisma.defesa.update({
      where: { id: defesaId },
      data: { status },
    });
  },

  async autoConcluirDefesasPassadas() {
    const agora = new Date();

    const result = await prisma.defesa.updateMany({
      where: {
        status: 'DIVULGADO',
        dataHora: {
          lt: agora,
        },
      },
      data: {
        status: 'CONCLUIDO',
      },
    });

    return result;
  },

  // ========= Gerenciamento ===========

  async listarParaGerenciamento() {
    return prisma.defesa.findMany({
      where: {
        status: {
          in: ['AGUARDANDO_VALIDACAO', 'VALIDADO', 'DIVULGADO', 'CONCLUIDO'],
        },
      },
      include: {
        candidato: true,
        orientador: true,
      },
      orderBy: {
        dataHora: 'asc',
      },
    });
  },

  async processarAprovacao(
    defesaId: string,
    action: 'APROVAR' | 'REJEITAR',
    motivoCorrecao?: string,
  ) {
    let newStatus: DefesaStatus;
    let correcaoData: string | null;

    if (action === 'APROVAR') {
      newStatus = 'VALIDADO';
      correcaoData = null;
    } else {
      newStatus = 'EM_CORRECAO';
      correcaoData = motivoCorrecao || 'Correção solicitada.';
    }

    return prisma.defesa.update({
      where: { id: defesaId },
      data: {
        status: newStatus,
        correcaoSolicitada: correcaoData,
      },
    });
  },

  // ========= listagem (COM FILTRO DE PROFESSOR) =========
  async listar(
    params: ListarParams & { orientadorId?: number } = {},
  ): Promise<DefesaListItem[]> {
    const where = buildWhere(params);
    const rows = await prisma.defesa.findMany({
      where,
      include: {
        candidato: true,
      },
      orderBy: [{ dataHora: 'desc' }, { createdAt: 'desc' }],
    });
    return rows.map(mapListItem);
  },

  async contarPorStatus(orientadorId?: number): Promise<{
    counts: Record<DefesaStatus, number>;
    total: number;
  }> {
    const whereClause: Prisma.DefesaWhereInput = {};
    if (orientadorId) {
      whereClause.orientadorId = orientadorId;
    }

    const gb = await prisma.defesa.groupBy({
      by: ['status'],
      _count: { _all: true },
      where: whereClause,
    });
    const base: Record<DefesaStatus, number> = {
      RASCUNHO: 0,
      AGUARDANDO_VALIDACAO: 0,
      EM_CORRECAO: 0,
      VALIDADO: 0,
      DIVULGADO: 0,
      CONCLUIDO: 0,
      CANCELADO: 0,
    };
    gb.forEach((g) => (base[g.status] = g._count._all));
    const total = gb.reduce((acc, g) => acc + g._count._all, 0);
    return { counts: base, total };
  },

  async saveUploadPortaria(defesaId: string, file: Express.Multer.File) {
    await prisma.defesaUpload.deleteMany({
      where: { defesaId, tipo: 'PORTARIA_PDF' },
    });

    return prisma.defesaUpload.create({
      data: {
        defesaId,
        tipo: 'PORTARIA_PDF',
        path: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  },
};
