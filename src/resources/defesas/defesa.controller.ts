import prisma from '@client/prismaClient';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DefesaService } from './defesa.service';
import { sendEmailWithFile } from '../email/email.service';
import { DefesaStatus, DefesaTipo, DefesaNivel } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import {
  FinalStep1Dto,
  FinalStep3Dto,
  FinalStep6Dto,
  MembroInput,
  QualiStep1Dto,
} from '@resources/defesas/defesa.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}
function canAccess(req: Request): boolean {
  return Boolean(
    req.session &&
    req.session.tipoUsuario &&
    (!!req.session.tipoUsuario.professor ||
      !!req.session.tipoUsuario.administrador ||
      !!req.session.tipoUsuario.secretaria),
  );
}

function dataPorExtenso(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function horarioFormatado(date: Date) {
  return date
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h');
}

function isEnumValue<T extends string>(
  vals: readonly string[],
  v?: string,
): v is T {
  return !!v && vals.includes(v);
}

// mapeia status => classe de badge (Bootstrap/AdminLTE)
function statusBadgeClass(s: DefesaStatus) {
  switch (s) {
    case 'RASCUNHO':
      return 'badge-secondary';
    case 'AGUARDANDO_VALIDACAO':
      return 'badge-warning';
    case 'EM_CORRECAO':
      return 'badge-danger';
    case 'VALIDADO':
      return 'badge-info';
    case 'DIVULGADO':
      return 'badge-primary';
    case 'CONCLUIDO':
      return 'badge-success';
    case 'CANCELADO':
      return 'badge-danger';
    default:
      return 'badge-light';
  }
}
function labelStatus(s: DefesaStatus) {
  const map: Record<DefesaStatus, string> = {
    RASCUNHO: 'Rascunho',
    EM_CORRECAO: 'Em Correção',
    AGUARDANDO_VALIDACAO: 'Aguardando',
    VALIDADO: 'Validado',
    DIVULGADO: 'Divulgado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  };
  return map[s];
}
function formatPtBR(
  dateIso?: string | Date,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
  },
) {
  if (!dateIso) return '';
  const d = typeof dateIso === 'string' ? new Date(dateIso) : dateIso;
  if (isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('pt-BR', options).format(d);
  } catch {
    return d.toLocaleString('pt-BR', options);
  }
}

const viewList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }

    if (!req.session?.tipoUsuario?.professor) {
      res.status(StatusCodes.FORBIDDEN).render('error', {
        message:
          'Acesso restrito: Apenas professores podem acessar "Minhas Defesas".',
      });
      return;
    }

    const filtroOrientadorId = Number(
      (req.session as any).uid ?? (req.session as any).userId,
    );

    await DefesaService.autoConcluirDefesasPassadas();

    const statusParam = (req.query.status as string | undefined) ?? 'TODOS';
    const tipoParam = req.query.tipo as string | undefined;
    const nivelParam = req.query.nivel as string | undefined;

    const statusFilter = isEnumValue<DefesaStatus>(
      Object.values(DefesaStatus),
      statusParam,
    )
      ? (statusParam as DefesaStatus)
      : undefined;
    const tipoFilter = isEnumValue<DefesaTipo>(
      Object.values(DefesaTipo),
      tipoParam,
    )
      ? (tipoParam as DefesaTipo)
      : undefined;
    const nivelFilter = isEnumValue<DefesaNivel>(
      Object.values(DefesaNivel),
      nivelParam,
    )
      ? (nivelParam as DefesaNivel)
      : undefined;

    const defesasRaw = await DefesaService.listar({
      status: statusFilter,
      tipo: tipoFilter,
      nivel: nivelFilter,
      orientadorId: filtroOrientadorId,
    });

    const defesas = defesasRaw.map((d) => {
      const editUrl =
        d.tipo === 'QUALIFICACAO'
          ? `/defesas/editar/${d.id}/qualificacao/step1`
          : `/defesas/editar/${d.id}/final/step1`;
      return {
        ...d,
        dataHoraInicioFmt: formatPtBR(d.dataHora),
        dataHoraFimFmt: '',
        statusLabel: labelStatus(d.status),
        statusClass: statusBadgeClass(d.status),
        localOuLink: d.localOuLink ?? '',
        editUrl,
      };
    });

    const { counts, total } =
      await DefesaService.contarPorStatus(filtroOrientadorId);

    const chips = [
      { key: 'TODOS', label: 'Todos', count: total, active: !statusFilter },
      {
        key: 'RASCUNHO',
        label: 'Rascunho',
        count: counts.RASCUNHO,
        active: statusFilter === 'RASCUNHO',
      },
      {
        key: 'AGUARDANDO_VALIDACAO',
        label: 'Aguardando',
        count: counts.AGUARDANDO_VALIDACAO,
        active: statusFilter === 'AGUARDANDO_VALIDACAO',
      },
      {
        key: 'VALIDADO',
        label: 'Validado',
        count: counts.VALIDADO,
        active: statusFilter === 'VALIDADO',
      },
      {
        key: 'DIVULGADO',
        label: 'Divulgado',
        count: counts.DIVULGADO,
        active: statusFilter === 'DIVULGADO',
      },
      {
        key: 'CONCLUIDO',
        label: 'Concluído',
        count: counts.CONCLUIDO,
        active: statusFilter === 'CONCLUIDO',
      },
      {
        key: 'CANCELADO',
        label: 'Cancelado',
        count: counts.CANCELADO,
        active: statusFilter === 'CANCELADO',
      },
    ];

    res.render(resolveView('list'), {
      defesas,
      chips,
      filtroStatus: statusFilter ?? 'TODOS',
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      page: 'defesas-listar',
    });
  } catch (err) {
    next(err);
  }
};

const excluirDefesa = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;
    await DefesaService.excluir(id);
    res.redirect('/defesas/listar');
  } catch (err) {
    next(err);
  }
};

const criarDefesa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }

    switch (req.method) {
      case 'GET': {
        const tipoQ = req.query.tipo as string | undefined;
        const nivelQ = req.query.nivel as string | undefined;

        const tipo = isEnumValue<DefesaTipo>(Object.values(DefesaTipo), tipoQ)
          ? (tipoQ as DefesaTipo)
          : undefined;
        const nivel = isEnumValue<DefesaNivel>(
          Object.values(DefesaNivel),
          nivelQ,
        )
          ? (nivelQ as DefesaNivel)
          : undefined;

        if (!tipo || !nivel) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send('Informe tipo e nível válidos para criar a defesa.');
          return;
        }

        const userId = Number(
          (req.session as any)?.uid ?? (req.session as any)?.userId,
        );
        if (!userId) {
          res.status(StatusCodes.UNAUTHORIZED).send('Sessão inválida.');
          return;
        }

        const created = await DefesaService.createInit({ tipo, nivel }, userId);

        if (tipo === 'QUALIFICACAO') {
          res.redirect(`/defesas/editar/${created.id}/qualificacao/step1`);
        } else {
          res.redirect(`/defesas/editar/${created.id}/final/step1`);
        }
        break;
      }
      default:
        res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
        break;
    }
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 1 (GET) */
const viewQualiStep1 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    const docentes = await prisma.usuario.findMany({
      where: { professor: 1, status: 1 },
      orderBy: { nomeCompleto: 'asc' },
    });

    const alunos = await prisma.candidato.findMany({
      orderBy: { nome: 'asc' },
    });

    res.render(resolveView('quali-step1'), {
      defesa,
      docentes,
      alunos,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 1 (POST) */
const saveQualiStep1 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;
    const { body } = req;

    const payload: QualiStep1Dto = {
      tituloTrabalho: body.tituloTrabalho,
      candidatoId: body.candidatoId || null,
      orientadorId: body.orientadorId ? Number(body.orientadorId) : null,
      dataHora: body.dataHora || undefined,
      modalidade: body.modalidade,
    };

    if (body.coorientadorTipo === 'INTERNO') {
      payload.coorientadorId = body.coorientadorId
        ? Number(body.coorientadorId)
        : null;
      payload.coorientadorExternoNome = null;
      payload.coorientadorExternoInstituicao = null;
    } else if (body.coorientadorTipo === 'EXTERNO') {
      payload.coorientadorId = null;
      payload.coorientadorExternoNome = body.coorientadorExternoNome;
      payload.coorientadorExternoInstituicao =
        body.coorientadorExternoInstituicao;
    } else {
      payload.coorientadorId = null;
      payload.coorientadorExternoNome = null;
      payload.coorientadorExternoInstituicao = null;
    }

    await DefesaService.updateQualiStep1(id, payload);

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step2`);
    }

    res.redirect(`/defesas/editar/${id}/qualificacao/step1`);
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 2 (GET) */
const viewQualiStep2 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    res.render(resolveView('quali-step2'), {
      defesa,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 2 (POST) */
const saveQualiStep2 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    await DefesaService.updateQualiStep2(id, {
      local: req.body.local,
    });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step3`);
    }

    res.redirect(`/defesas/editar/${id}/qualificacao/step2`);
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 3 (GET) */
const viewQualiStep3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    res.render(resolveView('quali-step3'), {
      defesa,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 3 (POST) */
const saveQualiStep3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const creditosOk = req.body.creditosMinimosOk === 'true';

    await DefesaService.updateQualiStep3(id, {
      resumoOuAbstract: req.body.resumoOuAbstract,
      palavrasChaves: req.body.palavrasChaves,
      creditosMinimosOk: creditosOk,
    });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step4`);
    }

    res.redirect(`/defesas/editar/${id}/qualificacao/step3`);
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 4 (GET) */
const viewQualiStep4 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    let coorientadorNome = null;
    if (defesa.coorientador) {
      coorientadorNome = defesa.coorientador.nomeCompleto;
    } else if (defesa.coorientadorExternoNome) {
      coorientadorNome = defesa.coorientadorExternoNome;
    }

    res.render(resolveView('quali-step4'), {
      defesa,
      orientadorNome: defesa.orientador?.nomeCompleto || 'Não definido',
      coorientadorNome: coorientadorNome,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 4 (POST) */
const saveQualiStep4 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    await DefesaService.updateQualiStep4(id, {
      presidenteOrigem: req.body.presidenteOrigem,
    });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step5`);
    }

    res.redirect(`/defesas/editar/${id}/qualificacao/step4`);
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 5 (GET) */
const viewQualiStep5 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    const membrosTitulares = defesa.membros.filter(
      (m) => m.papel === 'MEMBRO' && m.suplente === false,
    );

    res.render(resolveView('quali-step5'), {
      defesa,
      membrosTitulares,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 5 (POST) */
const saveQualiStep5 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    let membrosTitulares = (req.body.membrosTitulares || []) as MembroInput[];

    membrosTitulares = membrosTitulares.filter(
      (m) => m.nome && m.nome.trim() !== '',
    );

    await DefesaService.updateQualiStep5(id, {
      membrosTitulares,
    });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step6`);
    }

    res.redirect(`/defesas/editar/${id}/qualificacao/step5`);
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 6 (GET) */
const viewQualiStep6 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    const suplentes = defesa.membros.filter((m) => m.suplente === true);

    res.render(resolveView('quali-step6'), {
      defesa,
      suplentes,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 6 (POST) */
const saveQualiStep6 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    let suplentes = (req.body.suplentes || []) as MembroInput[];

    suplentes = suplentes.filter((s) => s.nome && s.nome.trim() !== '');

    await DefesaService.updateQualiStep6(id, {
      suplentes,
    });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step7`);
    }

    res.redirect(`/defesas/editar/${id}/qualificacao/step6`);
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 7 (GET) */
const viewQualiStep7 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    const propostaAnexada = defesa.uploads.find(
      (up) => up.tipo === 'PROPOSTA_PDF',
    );

    res.render(resolveView('quali-step7'), {
      defesa,
      propostaAnexada,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      helpers: {
        formatBytes: (bytes: number, decimals = 2) => {
          if (!+bytes) return '0 Bytes';
          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/** QUALIFICAÇÃO — STEP 7 (POST) - FINAL SUBMISSION */
const saveQualiStep7 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    await DefesaService.updateQualiStep7(id, {
      doutoradoArtigoComprovado: req.body.doutoradoArtigoComprovado === 'true',
      artigoTitulo: req.body.artigoTitulo,
      artigoVeiculoOuDoi: req.body.artigoVeiculoOuDoi,
      autoavaliacaoPreenchida: req.body.autoavaliacaoPreenchida === 'true',
    });

    if (req.file) {
      await DefesaService.saveUpload(id, req.file);
    } else {
      const existingUpload = await prisma.defesaUpload.findFirst({
        where: { defesaId: id, tipo: 'PROPOSTA_PDF' },
      });
      if (!existingUpload) {
        throw new Error('O arquivo da proposta é obrigatório.');
      }
    }

    await DefesaService.validateAndSubmit(id);
    req.session.save(() => {
      res.locals.toastMessage = 'Defesa submetida para validação com sucesso!';
      res.locals.toastType = 'success';
      res.redirect(`/defesas/listar?status=AGUARDANDO_VALIDACAO`);
    });
  } catch (err: any) {
    console.error('Erro na submissão da Etapa 7:', err);
    req.session.save(() => {
      res.locals.errors = [err.message || 'Erro ao submeter a defesa.'];
      res.redirect(`/defesas/editar/${req.params.id}/qualificacao/step7`);
    });
  }
};

/** DEFESA FINAL — STEP 1 (GET) */
const viewFinalStep1 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    const docentes = await prisma.usuario.findMany({
      where: { professor: 1, status: 1 },
      orderBy: { nomeCompleto: 'asc' },
    });

    const linhasDePesquisa = await prisma.linhaPesquisa.findMany({
      orderBy: { nome: 'asc' },
    });

    res.render(resolveView('final-step1'), {
      defesa,
      docentes,
      linhasDePesquisa,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** DEFESA FINAL — STEP 1 (POST) */
const saveFinalStep1 = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { body } = req;

    const payload: FinalStep1Dto = {
      tituloTrabalho: body.tituloTrabalho,
      linhaPesquisaId: body.linhaPesquisaId || null,
      candidatoId: body.candidatoId || null,
      orientadorId: body.orientadorId ? Number(body.orientadorId) : null,
      dataHora: body.dataHora || undefined,
      modalidade: body.modalidade,
    };

    await DefesaService.updateFinalStep1(id, payload);

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/final/step2`);
    }
    res.redirect(`/defesas/editar/${id}/final/step1`);
  } catch (err: any) {
    console.error('Erro ao salvar Etapa 1 (Final):', err);
    res.redirect(
      `/defesas/editar/${id}/final/step1?error=${encodeURIComponent(err.message)}`,
    );
  }
};

/** DEFESA FINAL — STEP 2 (GET) */
const viewFinalStep2 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    res.render('../resources/defesas/views/final-step2', {
      defesa,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** DEFESA FINAL — STEP 2 (POST) */
const saveFinalStep2 = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    await DefesaService.updateFinalStep2(id, {
      localOuLink: req.body.local,
    });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/final/step3`);
    }

    res.redirect(`/defesas/editar/${id}/final/step2`);
  } catch (err: any) {
    console.error('Erro ao salvar Etapa 2 (Final):', err);
    res.redirect(
      `/defesas/editar/${id}/final/step2?error=${encodeURIComponent(err.message)}`,
    );
  }
};

/** DEFESA FINAL — STEP 3 (GET) */
const viewFinalStep3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    res.render('../resources/defesas/views/final-step3', {
      defesa,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** DEFESA FINAL — STEP 3 (POST) */
const saveFinalStep3 = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!canAccess(req)) {
      res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
      return;
    }
    const { body } = req;

    const payload: FinalStep3Dto = {
      resumoPt: body.resumoPt,
      palavrasChavePt: body.palavrasChavePt,
      abstractEn: body.abstractEn,
      keywordsEn: body.keywordsEn,
      idiomaTese: body.idiomaTese,
      creditosOk: body.creditosOk === 'true',
      creditosExigidos: body.creditosExigidos
        ? parseInt(body.creditosExigidos)
        : undefined,
    };

    await DefesaService.updateFinalStep3(id, payload);

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/final/step4`);
    }
    res.redirect(`/defesas/editar/${id}/final/step3`);
  } catch (err: any) {
    console.error('Erro ao salvar Etapa 3 (Final):', err);
    res.redirect(
      `/defesas/editar/${id}/final/step3?error=${encodeURIComponent(err.message)}`,
    );
  }
};

/** DEFESA FINAL — STEP 4 (GET) - Membros Titulares */
const viewFinalStep4 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
    }
    const { id } = req.params;
    const defesa = await DefesaService.buscarPorId(id);

    let coorientadorNome = null;
    if (defesa.coorientador)
      coorientadorNome = defesa.coorientador.nomeCompleto;
    else if (defesa.coorientadorExternoNome)
      coorientadorNome = defesa.coorientadorExternoNome;

    const membrosTitulares = defesa.membros.filter((m) => !m.suplente);

    res.render('../resources/defesas/views/final-step4', {
      defesa,
      coorientadorNome,
      membrosTitulares,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    next(err);
  }
};

/** DEFESA FINAL — STEP 4 (POST) - Membros Titulares */
const saveFinalStep4 = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!canAccess(req)) {
    }
    let membrosTitulares = (req.body.membrosTitulares || []) as MembroInput[];
    membrosTitulares = membrosTitulares.filter(
      (m) => m.nome && m.nome.trim() !== '',
    );

    await DefesaService.updateFinalStep4(id, { membrosTitulares });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/final/step5`);
    }
    res.redirect(`/defesas/editar/${id}/final/step4`);
  } catch (err: any) {
    console.error('Erro ao salvar Etapa 4 (Final):', err);
    res.redirect(
      `/defesas/editar/${id}/final/step4?error=${encodeURIComponent(err.message)}`,
    );
  }
};

/** DEFESA FINAL — STEP 5 (GET) - Suplentes */
const viewFinalStep5 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
    }
    const { id } = req.params;
    const defesa = await DefesaService.buscarPorId(id);
    const suplentes = defesa.membros.filter((m) => m.suplente);

    res.render('../resources/defesas/views/final-step5', {
      defesa,
      suplentes,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      helpers: {},
    });
  } catch (err) {
    next(err);
  }
};

/** DEFESA FINAL — STEP 5 (POST) - Suplentes */
const saveFinalStep5 = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!canAccess(req)) {
    }
    let suplentes = (req.body.suplentes || []) as MembroInput[];
    suplentes = suplentes.filter((s) => s.nome && s.nome.trim() !== '');

    await DefesaService.updateFinalStep5(id, { suplentes });

    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/final/step6`);
    }
    res.redirect(`/defesas/editar/${id}/final/step5`);
  } catch (err: any) {
    console.error('Erro ao salvar Etapa 5 (Final):', err);
    res.redirect(
      `/defesas/editar/${id}/final/step5?error=${encodeURIComponent(err.message)}`,
    );
  }
};

/** DEFESA FINAL — STEP 6 (GET) - Documentos */
const viewFinalStep6 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!canAccess(req)) {
    }
    const { id } = req.params;

    const defesa = await DefesaService.buscarPorId(id);

    const teseAnexada = defesa.uploads.find((up) => up.tipo === 'TESE_PDF');

    res.render('../resources/defesas/views/final-step6', {
      defesa,
      teseAnexada,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      helpers: {
        formatBytes: (bytes: number, decimals = 2) => {
          if (!+bytes) return '0 Bytes';
          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/** DEFESA FINAL — STEP 6 (POST) - Final Submission */
const saveFinalStep6 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    if (!canAccess(req)) {
    }
    const { body } = req;

    const payload: FinalStep6Dto = {
      artigoEstratoSuperiorOk: body.artigoEstratoSuperiorOk === 'true',
      artigoTitulo: body.artigoTitulo,
      artigoVeiculoOuDoi: body.artigoVeiculoOuDoi,
      incluiuAgradecimentosObrigatorios:
        body.incluiuAgradecimentosObrigatorios === 'true',
      autoavaliacaoPreenchida: body.autoavaliacaoPreenchida === 'true',
    };
    await DefesaService.updateFinalStep6(id, payload);

    if (req.file) {
      await DefesaService.saveUploadTese(id, req.file);
    } else {
      const existingUpload = await prisma.defesaUpload.findFirst({
        where: { defesaId: id, tipo: 'TESE_PDF' },
      });
      if (!existingUpload) {
        throw new Error('O arquivo da tese/dissertação é obrigatório.');
      }
    }

    await DefesaService.validateAndSubmit(id);

    req.session.save(() => {
      res.locals.toastMessage =
        'Defesa Final submetida para validação com sucesso!';
      res.locals.toastType = 'success';
      res.redirect(`/defesas/listar?status=AGUARDANDO_VALIDACAO`);
    });
  } catch (err: any) {
    console.error('Erro na submissão da Etapa 6 (Final):', err);
    req.session.save(() => {
      res.locals.errors = [err.message || 'Erro ao submeter a defesa.'];
      res.redirect(`/defesas/editar/${id}/final/step6`);
    });
  }
};

//** SECRETARIA: Ver lista de defesas para gerenciar */
const viewManagementList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tipoUsuario = req.session?.tipoUsuario;
    if (
      !tipoUsuario ||
      (!tipoUsuario.secretaria && !tipoUsuario.administrador)
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
    }

    await DefesaService.autoConcluirDefesasPassadas();

    const defesasRaw = await DefesaService.listarParaGerenciamento();

    const defesas = defesasRaw.map((d) => {
      const editUrl =
        d.tipo === 'QUALIFICACAO'
          ? `/defesas/editar/${d.id}/qualificacao/step1`
          : `/defesas/editar/${d.id}/final/step1`;

      return {
        id: d.id,
        candidatoNome: d.candidato?.nome ?? 'Não vinculado',
        orientadorNome: d.orientador?.nomeCompleto ?? '—',
        tipo: d.tipo,
        nivel: d.nivel,
        dataDefesaFmt: formatPtBR(d.dataHora, {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
        status: d.status,
        editUrl: editUrl,
        isAguardando: d.status === 'AGUARDANDO_VALIDACAO',
        isValidado: d.status === 'VALIDADO',
      };
    });
    res.render(resolveView('gerenciar-defesas'), {
      defesas,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      page: 'defesas-gerenciar',
    });
  } catch (err) {
    next(err);
  }
};

const viewReviewPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !req.session?.tipoUsuario?.secretaria &&
      !req.session?.tipoUsuario?.administrador
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
    }
    const { id } = req.params;
    const defesa = await DefesaService.buscarPorId(id);

    let coorientadorDisplay = { nome: 'Nenhum', instituicao: 'N/A' };
    if (defesa.coorientador) {
      coorientadorDisplay.nome = defesa.coorientador.nomeCompleto;
      coorientadorDisplay.instituicao = 'ICOMP/UFAM (Interno)';
    } else if (defesa.coorientadorExternoNome) {
      coorientadorDisplay.nome = defesa.coorientadorExternoNome;
      coorientadorDisplay.instituicao =
        defesa.coorientadorExternoInstituicao || 'Externa';
    }

    const dataHoraFormatada = formatPtBR(defesa.dataHora, {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const uploads = {
      proposta: defesa.uploads.find((up) => up.tipo === 'PROPOSTA_PDF'),
      tese: defesa.uploads.find((up) => up.tipo === 'TESE_PDF'),
    };

    res.render(resolveView('revisar-defesas'), {
      defesa,
      coorientadorDisplay,
      dataHoraFormatada,
      uploads,
      orientadorNome: defesa.orientador?.nomeCompleto || 'N/A',
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      page: 'defesas-gerenciar',
    });
  } catch (err) {
    next(err);
  }
};

/** SECRETARIA: Processar Aprovação (Aprovar / Rejeitar) */
const processApproval = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const tipoUsuario = req.session?.tipoUsuario;
    if (
      !tipoUsuario ||
      (!tipoUsuario.secretaria && !tipoUsuario.administrador)
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
    }

    const { action, motivoCorrecao } = req.body;

    if (action === 'APROVAR') {
      await DefesaService.processarAprovacao(id, 'APROVAR');
    } else if (action === 'REJEITAR') {
      if (!motivoCorrecao || motivoCorrecao.trim() === '') {
        throw new Error('O motivo da correção é obrigatório para rejeitar.');
      }
      await DefesaService.processarAprovacao(id, 'REJEITAR', motivoCorrecao);
    }

    res.redirect('/defesas/gerenciar');
  } catch (err: any) {
    console.error('Erro ao processar aprovação:', err);
    req.session.save(() => {
      res.locals.errors = [err.message || 'Erro ao processar aprovação.'];
      res.redirect(`/defesas/gerenciar`);
    });
  }
};

/** GERAR TEXTO DO EMAIL E MOSTRAR TELA */
const viewDivulgarDefesa = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !req.session?.tipoUsuario?.secretaria &&
      !req.session?.tipoUsuario?.administrador
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
    }
    const { id } = req.params;
    const defesa = await DefesaService.buscarPorId(id);

    const nivelLabel = defesa.nivel === 'MESTRADO' ? 'Mestrado' : 'Doutorado';
    const tipoLabel =
      defesa.tipo === 'QUALIFICACAO' ? 'Qualificação' : 'Defesa';
    const nivelExtenso =
      defesa.nivel === 'MESTRADO'
        ? `Dissertação de ${nivelLabel}`
        : `Tese de ${nivelLabel}`;
    const tipoEvento =
      defesa.tipo === 'QUALIFICACAO'
        ? 'Exame de Qualificação'
        : 'Defesa Pública';

    const membroPresidente = defesa.membros.find(
      (m) => m.papel === 'PRESIDENTE',
    );
    const nomePresidente =
      membroPresidente?.nome || defesa.orientador?.nomeCompleto || 'N/A';
    const instituicaoPresidente = membroPresidente?.instituicao || 'PPGI/UFAM';

    const titulares = defesa.membros.filter(
      (m) => m.papel === 'MEMBRO' && !m.suplente,
    );
    const suplentes = defesa.membros.filter((m) => m.suplente);

    let textoBanca = `PRESIDENTE:\n${nomePresidente} - ${instituicaoPresidente}\n\n`;

    textoBanca += `MEMBROS TITULARES:\n`;
    titulares.forEach((m) => {
      textoBanca += `${m.nome} - ${m.instituicao}\n`;
    });

    if (suplentes.length > 0) {
      textoBanca += `\nMEMBROS SUPLENTES:\n`;
      suplentes.forEach((m) => {
        textoBanca += `${m.nome} - ${m.instituicao}\n`;
      });
    }

    // 4. Formatação de Dados
    const resumo =
      defesa.tipo === 'QUALIFICACAO'
        ? defesa.quali?.resumoOuAbstract
        : defesa.final?.resumoPt;
    const resumoLimpo = resumo
      ? resumo.replace(/(\r\n|\n|\r)/gm, ' ')
      : 'Resumo não informado.';

    const dataExtenso = defesa.dataHora
      ? new Date(defesa.dataHora).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Data não definida';

    const horaFormatada = defesa.dataHora
      ? new Date(defesa.dataHora)
          .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          .replace(':', 'h')
      : '--h--';

    const assinatura = `Respeitosamente,

Bruno Freitas Gadelha
Coordenador do Programa de Pós-Graduação em Informática - PPGI/UFAM
--
Programa de Pós-Graduação em Informática
Instituto de Computação
Universidade Federal do Amazonas.
E-mail: secretariappgi@icomp.ufam.edu.br
Fones: (92) 3305-1181 Ramal: 1193 / 2808 / 2809`;

    // Formato: Convite: Qualificação de Mestrado_NomeDoCandidato
    const defaultSubject = `Convite: ${tipoLabel} de ${nivelLabel}_${defesa.candidato?.nome}`;

    const defaultBody = `A Coordenação do Programa de Pós-Graduação em Informática PPGI/UFAM convida a comunidade para assistir a realização da sessão pública de ${tipoEvento} de ${nivelExtenso}:

TÍTULO: ${defesa.tituloTrabalho}

CANDIDATO: ${defesa.candidato?.nome}

BANCA EXAMINADORA:

${textoBanca}

DATA: ${dataExtenso}

HORÁRIO: ${horaFormatada}

LOCAL: ${defesa.localOuLink}

RESUMO: ${resumoLimpo}

${assinatura}`;

    res.render('../resources/defesas/views/divulgar-defesa', {
      defesa,
      defaultBody,
      defaultSubject,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      page: 'defesas-gerenciar',
    });
  } catch (err) {
    next(err);
  }
};

/** ENVIAR EMAIL COM ANEXO */
const sendDivulgacaoEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const file = req.file;

  try {
    if (
      !req.session?.tipoUsuario?.secretaria &&
      !req.session?.tipoUsuario?.administrador
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Não autorizado');
    }

    const { to, subject, emailBody } = req.body;

    // 1. Salva a portaria no banco
    if (file) {
      await DefesaService.saveUploadPortaria(id, file);
    }

    // 2. Prepara anexo
    const attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        path: file.path,
      });
    }

    // Converte quebras de linha para <br>
    let htmlContent = emailBody.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');

    const titulosParaNegrito = [
      'TÍTULO:',
      'CANDIDATO:',
      'BANCA EXAMINADORA:',
      'PRESIDENTE:',
      'MEMBROS TITULARES:',
      'MEMBROS SUPLENTES:',
      'DATA:',
      'HORÁRIO:',
      'LOCAL:',
      'RESUMO:',
    ];
    titulosParaNegrito.forEach((titulo) => {
      const regex = new RegExp(titulo, 'g');
      htmlContent = htmlContent.replace(regex, `<strong>${titulo}</strong>`);
    });

    htmlContent = htmlContent.replace(
      /Bruno Freitas Gadelha/g,
      '<strong>Bruno Freitas Gadelha</strong>',
    );

    htmlContent = htmlContent.replace(
      /(sessão pública.*? de )(.+?)(:)/gi,
      '$1<strong>$2</strong>$3',
    );

    // -------------------------------------------

    // 3. Envia E-mail
    await sendEmailWithFile({
      to,
      subject,
      text: emailBody,
      html: htmlContent,
      attachments: attachments,
    });

    await DefesaService.updateStatus(id, 'DIVULGADO');

    req.session.save(() => {
      res.locals.toastMessage = 'E-mail de divulgação enviado com sucesso!';
      res.locals.toastType = 'success';
      res.redirect(`/defesas/gerenciar`);
    });
  } catch (err: any) {
    console.error('Erro ao enviar e-mail:', err);
    req.session.save(() => {
      res.locals.errors = ['Erro ao enviar e-mail: ' + err.message];
      res.redirect(`/defesas/divulgar/${id}`);
    });
  }
};

const downloadAnexo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.session.uid) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Acesso negado.');
    }

    const { uploadId } = req.params;

    const anexo = await prisma.defesaUpload.findUnique({
      where: { id: uploadId },
    });

    if (!anexo) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send('Arquivo não encontrado no sistema.');
    }

    const folderPath = path.join(
      process.cwd(),
      'uploads',
      'defesas',
      anexo.defesaId,
    );

    const filePath = path.join(folderPath, anexo.path);

    if (!fs.existsSync(filePath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send('O arquivo físico não foi encontrado no servidor.');
    }

    res.download(filePath, anexo.originalName, (err) => {
      if (err) {
        console.error('Erro ao baixar arquivo:', err);
        if (!res.headersSent) {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Erro ao realizar download.');
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export default {
  viewList,
  excluirDefesa,
  criarDefesa,
  // Wizard Qualificação
  viewQualiStep1,
  saveQualiStep1,
  viewQualiStep2,
  saveQualiStep2,
  viewQualiStep3,
  saveQualiStep3,
  viewQualiStep4,
  saveQualiStep4,
  viewQualiStep5,
  saveQualiStep5,
  viewQualiStep6,
  saveQualiStep6,
  viewQualiStep7,
  saveQualiStep7,
  //Wizard de Defesa Final
  saveFinalStep1,
  viewFinalStep1,
  saveFinalStep2,
  viewFinalStep2,
  viewFinalStep3,
  saveFinalStep3,
  saveFinalStep4,
  viewFinalStep4,
  saveFinalStep5,
  viewFinalStep5,
  saveFinalStep6,
  viewFinalStep6,
  //Funções auxiliares e secretaria
  processApproval,
  viewManagementList,
  viewReviewPage,
  viewDivulgarDefesa,
  sendDivulgacaoEmail,
  downloadAnexo,
};
