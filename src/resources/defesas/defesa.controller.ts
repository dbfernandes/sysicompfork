import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DefesaService } from './defesa.service';
import { DefesaStatus, DefesaTipo, DefesaNivel } from '@prisma/client';
import path from 'path';

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
    AGUARDANDO_VALIDACAO: 'Aguardando',
    VALIDADO: 'Validado',
    DIVULGADO: 'Divulgado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  };
  return map[s];
}
function formatPtBR(dateIso?: string) {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return d.toLocaleString('pt-BR');
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

    const { counts, total } = await DefesaService.contarPorStatus();

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

// criação mínima: GET /defesas/adicionar?tipo=QUALIFICACAO&nivel=MESTRADO
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

        // redireciona direto para o step1 correto
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

    // Aqui você pode buscar dados reais; por enquanto, dá pra mockar alguns campos
    // Ex.: const defesa = await prisma.defesa.findUnique({ where: { id }, include: { orientador: true, candidato: true }});
    const defesa = {
      id,
      tipo: 'QUALIFICACAO',
      nivel: 'MESTRADO',
      tituloTrabalho: '',
      dataHora: '',
      modalidade: '',
      coorientadorId: null,
    };

    const docentes = []; // popular com seus usuários (orientadores/coorientadores)
    const candidatoNome = req.session?.nome ?? '';
    const orientadorNome = ''; // opcional
    console.log(candidatoNome);
    res.render(resolveView('quali-step1'), {
      defesa,
      candidatoNome,
      orientadorNome,
      docentes,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (err) {
    console.log('err', err);
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
    await DefesaService.updateQualiStep1(id, {
      tituloTrabalho: req.body.tituloTrabalho,
      coorientadorId: req.body.coorientadorId
        ? Number(req.body.coorientadorId)
        : null,
      dataHora: req.body.dataHora || undefined, // já vem em ISO do form
      modalidade: req.body.modalidade || undefined, // PRESENCIAL | ONLINE
    });

    // decide fluxo pelo botão
    if (req.body.action === 'next') {
      return res.redirect(`/defesas/editar/${id}/qualificacao/step2`);
    }
    // se apenas salvou, fica na mesma página com mensagem
    res.redirect(`/defesas/editar/${id}/qualificacao/step1`);
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
};
