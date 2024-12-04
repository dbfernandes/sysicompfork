import { Request, Response } from 'express';

import reservasService from './reservas.service';
import salasService from '../salas/salas.service';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listar = async (req: Request, res: Response) => {
  const reservas = await reservasService.listarTodos();
  // res.json({ reservas: reservas.map((sala: { toJSON: () => any; }) => sala.toJSON()) })
  res.json({ reservas });
};

const adicionar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    const salas = await salasService.listarTodos()
    res.status(StatusCodes.OK).render(resolveView('reservas-adicionar'), {
      salas: salas,
      nome: req.session.nome,
      UsuarioId: req.session.uid,
      csrf: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
    });
  } else if (req.method === 'POST') {
    try {
      if (req.body.dataTermino === '') {
        req.body.dataTermino = req.body.dataInicio;
        req.body.dias = '';
      } else {
        if (typeof req.body.dia === 'string') {
          const dias = req.body.dia;
          req.body.dias = dias;
        } else if (req.body.dia) {
          const dias = req.body.dia.join(', ');
          req.body.dias = dias;
        } else {
          req.body.dias = '';
        }
      }
      // const dados = {
      //   ...req.body
      // }
      const novaReserva: any = {
        SalaId: parseInt(req.body.SalaId),
        UsuarioId: parseInt(req.body.UsuarioId),
        atividade: req.body.atividade,
        dataInicio: req.body.dataInicio ? new Date(`${req.body.dataInicio}T00:00:00.000Z`) : null,
        dataTermino: req.body.dataTermino ? new Date(`${req.body.dataTermino}T00:00:00.000Z`) : null,
        tipo: req.body.tipo,
        horaInicio: req.body.horaInicio,
        horaTermino: req.body.horaTermino,
        dias: req.body.dias
      }

      await reservasService.criar(novaReserva)

      // if (!reserva) {
      //   res.redirect('/reservas/gerenciar')
      // }

      res.redirect('/reservas/gerenciar');
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e });
    }
  }
};

const excluir = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reserva = await reservasService.buscarReserva(parseInt(id));
  try {
    if (!reserva) throw new Error('Sala não encontrado!');

    await reservasService.remover(parseInt(id));
    res.redirect('/reservas/gerenciar');
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: e.message });
  }
};

const gerenciar = async (req: Request, res: Response) => {
  const reservas = await reservasService.listarReservasSalas();
  // console.log(reservas)
  const reservasJSON = reservas.map((reserva: any) => {
    const reservaObj = {
      ...reserva,
      dataInicio: reserva.dataInicio
        ? reserva.dataInicio.toLocaleDateString('pt-BR')
        : null,
      dataTermino: reserva.dataTermino
        ? reserva.dataTermino.toLocaleDateString('pt-BR')
        : null,
      // horaInicio: reserva.horaInicio ? new Date(reserva.horaInicio).toLocaleTimeString('pt-BR', {timeZone: 'UTC'}) : null,
      // horaTermino: reserva.horaTermino ? new Date(reserva.horaTermino).toLocaleTimeString('pt-BR', {timeZone: 'UTC'}) : null
    };
    const dataAtual = new Date();
    const dataTerminoReserva = new Date(
      reservaObj.dataTermino + ' ' + reservaObj.horaTermino,
    );
    reservaObj.terminou = dataTerminoReserva < dataAtual;

    return reservaObj;
  });

  res.render(resolveView('reservas-gerenciar'), {
    reservas: reservasJSON,
    nome: req.session.nome,
    csrfToken: req.csrfToken(),
    tipoUsuario: req.session.tipoUsuario
  })
}

const editar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    try {
      const salas = await salasService.listarTodos()
      const reserva = await reservasService.buscarReserva(parseInt(req.params.id))
      if (!reserva) throw new Error('Reserva não encontrado!')
      console.log(reserva)

      res.status(StatusCodes.OK).render(resolveView('reservas-editar'), {
        salas: salas,
        nome: req.session.nome,
        reserva: reserva,
        csrf: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario
      })
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  } else if (req.method === 'POST') {
    if (req.body.dataTermino === '') {
      req.body.dataTermino = req.body.dataInicio;
      req.body.dias = '';
    } else {
      if (typeof req.body.dia === 'string') {
        const dias = req.body.dia;
        req.body.dias = dias;
      } else if (req.body.dia) {
        const dias = req.body.dia.join(', ');
        req.body.dias = dias;
        console.log(req.body.dias);
      } else {
        req.body.dias = '';
      }
    }

    // const dados = {
    //   ...req.body,
    //   dataInicio: req.body.dataInicio ? `${req.body.dataInicio}T00:00:00.000Z` : undefined
    // }
    const dados: any = {
      SalaId: parseInt(req.body.SalaId),
      UsuarioId: parseInt(req.body.UsuarioId),
      atividade: req.body.atividade,
      dataInicio: req.body.dataInicio ? new Date(`${req.body.dataInicio}T00:00:00.000Z`) : null,
      dataTermino: req.body.dataTermino ? new Date(`${req.body.dataTermino}T00:00:00.000Z`) : null,
      tipo: req.body.tipo,
      horaInicio: req.body.horaInicio,
      horaTermino: req.body.horaTermino,
      dias: req.body.dias
    }

    try {
      // const reserva = await ReservaSala.update({
      //     ...req.body
      // }, { where: { id: req.params.id } });
      await reservasService.atualizar(parseInt(req.params.id), dados);
      res.redirect('/reservas/gerenciar');
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  }
};

export default { adicionar, excluir, gerenciar, editar, listar };
