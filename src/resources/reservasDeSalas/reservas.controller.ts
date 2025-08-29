import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import reservasService from './reservas.service';
import salasService from '../salas/sala.service';
import path from 'path';
import { Prisma } from '@prisma/client';
import { ReservaFormularioDto } from './reservas.types';
import logger from '@utils/logger';

// Interfaces para tipagem dos dados

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listarReservas = async (req: Request, res: Response): Promise<void> => {
  try {
    const reservas = await reservasService.listarTodos();
    res.status(StatusCodes.OK).json({ reservas });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao listar reservas' });
  }
};

const criarReserva = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    try {
      const salas = await salasService.listarTodos();

      res.status(StatusCodes.OK).render(resolveView('reservasAdicionar'), {
        salas,
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
      res.redirect('/reservas/gerenciar');
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.redirect('/reservas/gerenciar');
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

const listarReservasFormatadas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reservas = await reservasService.listarReservasSalas();
    const reservasFormatadas = reservas.map((reserva) => ({
      ...reserva,
      dataInicio: reserva.dataInicio?.toLocaleDateString('pt-BR'),
      dataFim: reserva.dataFim?.toLocaleDateString('pt-BR'),
      terminou: reserva.dataFim
        ? new Date(reserva.dataFim) < new Date()
        : false,
    }));

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
      const salas = await salasService.listarTodos();
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
