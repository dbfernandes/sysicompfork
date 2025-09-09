import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import reservasService from './reservas.service';
import salasService from '../salas/sala.service';
import path from 'path';
import { Prisma } from '@prisma/client';
import { ReservaFormularioDto } from './reservas.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listarReservas = async (req: Request, res: Response): Promise<void> => {
  try {
    const reservas = await reservasService.listAll();
    res.status(StatusCodes.OK).json({ reservas });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao listar reservas' });
  }
};

const criarReserva = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.method === 'GET') {
    try {
      const salas = await salasService.listAll();
      const salaId = req.query.salaId;
      res.status(StatusCodes.OK).render(resolveView('reservasAdicionar'), {
        salas,
        salaId,
        nome: req.session.nome,
        usuarioId: req.session.uid,
        tipoUsuario: req.session.tipoUsuario,
      });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      res.redirect('/reservas/gerenciar');
    }
  } else if (req.method === 'POST') {
    try {
      const {
        salaId,
        usuarioId,
        atividade,
        tipo,
        dia,
        dataInicio,
        dataFim, // Mudado de dataTermino para dataFim
        horaInicio,
        horaFim, // Mudado de horaTermino para horaFim
      } = req.body as ReservaFormularioDto;
      console.log(req.body);
      // Processamento dos dias da semana
      const dias = Array.isArray(dia) ? dia.join(', ') : dia || '';

      // Conversão para o formato esperado pelo service
      const novaReserva: Prisma.ReservaSalaUncheckedCreateInput = {
        salaId: Number(salaId),
        usuarioId: Number(usuarioId),
        atividade,
        tipo,
        dias, // Campo dias para armazenar os dias da semana
        dataInicio,
        dataFim: dataFim || dataInicio,
        horaInicio,
        horaFim: horaFim || horaInicio,
      };

      await reservasService.criar(novaReserva);
      res.status(StatusCodes.CREATED).json(ReasonPhrases.CREATED);
    } catch (error) {
      next(error);
    }
  }
};

const deletarReserva = async (req: Request, res: Response): Promise<void> => {
  try {
    const reservaId = parseInt(req.params.id);
    const reserva = await reservasService.buscarReserva(reservaId);

    if (!reserva) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Reserva não encontrada' });
      return;
    }

    await reservasService.remover(reservaId);
    res.redirect('/reservas/gerenciar');
  } catch (error) {
    console.error('Erro ao excluir reserva:', error);
    res.redirect('/reservas/gerenciar');
  }
};
// utils/time.ts
export function toHHmm(input?: string | null): string | null {
  if (!input) return null;

  // remove espaços
  const s = String(input).trim();

  // Casos comuns:
  //  - "14:45:00" -> "14:45"
  //  - "14:45"    -> "14:45"
  const hhmmMatch = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (hhmmMatch) {
    const h = hhmmMatch[1].padStart(2, '0');
    const m = hhmmMatch[2];
    return `${h}:${m}`;
  }

  // fallback: tenta pegar HH e mm de algo como "9:5", "0945", "9-05", etc.
  const digits = s.replace(/[^\d]/g, ''); // só dígitos
  if (digits.length >= 3) {
    const h = digits.slice(0, digits.length - 2).padStart(2, '0');
    const m = digits.slice(-2);
    return `${h}:${m}`;
  }

  // se não deu pra entender, retorna null (ou o original, se preferir)
  return null;
}
const listarReservasFormatadas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reservas = await reservasService.listarReservasSalas();
    console.log(reservas);

    const reservasFormatadas = reservas.map((reserva) => ({
      ...reserva,
      horaInicio: toHHmm(reserva.horaInicio) ?? reserva.horaInicio, // garante "HH:mm"
      horaFim: toHHmm(reserva.horaFim) ?? reserva.horaFim,
      dataInicio: reserva.dataInicio?.toLocaleDateString('pt-BR'),
      dataFim: reserva.dataFim?.toLocaleDateString('pt-BR'),
      terminou: reserva.dataFim
        ? new Date(reserva.dataFim) < new Date()
        : false,
    }));
    console.log(reservasFormatadas);

    res.render(resolveView('reservasGerenciar'), {
      reservas: reservasFormatadas,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (error) {
    console.error('Erro ao gerenciar reservas:', error);
    res.redirect('/inicio');
  }
};

const editarReserva = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    try {
      const salas = await salasService.listAll();
      const reserva = await reservasService.buscarReserva(
        parseInt(req.params.id),
      );

      if (!reserva) {
        res.redirect('/reservas/gerenciar');
        return;
      }
      const date = new Date(reserva.dataInicio);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // mês começa em 0
      const dd = String(date.getDate()).padStart(2, '0');

      const dataInicio = `${yyyy}-${mm}-${dd}`;
      const date2 = new Date(reserva.dataFim || reserva.dataInicio);
      const yyyy2 = date2.getFullYear();
      const mm2 = String(date2.getMonth() + 1).padStart(2, '0'); // mês começa em 0
      const dd2 = String(date2.getDate()).padStart(2, '0');
      const dataFim = `${yyyy2}-${mm2}-${dd2}`;

      res.render(resolveView('reservasEditar'), {
        salas,
        nome: req.session.nome,
        reserva: {
          ...reserva,
          dataInicio,
          dataFim,
        },
        tipoUsuario: req.session.tipoUsuario,
      });
    } catch (error) {
      console.error('Erro ao carregar edição:', error);
      res.redirect('/reservas/gerenciar');
    }
  } else if (req.method === 'POST') {
    try {
      const usuarioId = req.session.uid;
      const reservaId = parseInt(req.params.id);
      const {
        salaId,
        atividade,
        tipo,
        dia,
        dataInicio,
        dataFim, // Mudado de dataTermino para dataFim
        horaInicio,
        horaFim, // Mudado de horaTermino para horaFim
      } = req.body as ReservaFormularioDto;

      // Processamento dos dias da semana
      const dias = Array.isArray(dia) ? dia.join(', ') : dia || '';

      const dadosAtualizados: Prisma.ReservaSalaUncheckedUpdateInput = {
        salaId: Number(salaId),
        usuarioId: Number(usuarioId),
        atividade,
        tipo,
        dias,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : new Date(dataInicio),
        horaInicio,
        horaFim: horaFim || horaInicio,
      };

      await reservasService.atualizar(reservaId, dadosAtualizados);
      res.redirect('/reservas/gerenciar');
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      res.redirect('/reservas/gerenciar');
    }
  }
};

export default {
  criarReserva,
  deletarReserva,
  listarReservasFormatadas,
  editarReserva,
  listarReservas,
};
