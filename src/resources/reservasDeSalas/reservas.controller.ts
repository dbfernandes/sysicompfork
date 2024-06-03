import { Request, Response } from 'express';
import { CreateReservaDto } from './reservas.types';

import ReservaService from './reservas.service';
import salasService from '../salas/salas.service';
import path from 'path';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listar = async (req:Request, res: Response) => {
  const reservas = await ReservaService.listarTodos()
  // res.json({ reservas: reservas.map((sala: { toJSON: () => any; }) => sala.toJSON()) })
  res.json({ reservas: reservas })
}

const adicionar = async (req:Request, res: Response) => {
  if (req.method === 'GET') {
    const salas = await salasService.listarTodos()
    res.render(resolveView('reservas-adicionar'), {
      salas: salas,
      nome: req.session.nome,
      UsuarioId: req.session.uid,
      csrf: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario
    })
  } else if (req.method === 'POST') {
    try {
      if (req.body.dataTermino === '') {
        req.body.dataTermino = req.body.dataInicio
        req.body.dias = ''
      } else {
        if (typeof req.body.dia === 'string') {
          const dias = req.body.dia
          req.body.dias = dias
        } else if (req.body.dia) {
          const dias = req.body.dia.join(', ')
          req.body.dias = dias
        } else {
          req.body.dias = ''
        }
      }
      // const dados = {
      //   ...req.body
      // }
      const novaReserva: CreateReservaDto = {
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

      await ReservaService.criar(novaReserva)

      // if (!reserva) {
      //   res.redirect('/reservas/gerenciar')
      // }

      res.redirect('/reservas/gerenciar')
    } catch (e) {
      console.log(e)
      res.status(500).send({ error: e })
    }
  }
}

const excluir = async (req:Request, res: Response) => {
  const { id } = req.params
  const reserva = await ReservaService.buscarReserva(parseInt(id))
  try {
    if (!reserva) throw new Error('Sala não encontrado!')

    await ReservaService.remover(parseInt(id))
    res.redirect('/reservas/gerenciar')
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e })
  }
}

const gerenciar = async (req:Request, res: Response) => {
  const reservas = await ReservaService.listarReservasSalas()
  const reservasJSON = reservas.map((reserva: any) => {
    const reservaObj = {
      ...reserva,
      dataInicio: reserva.dataInicio ? reserva.dataInicio.toLocaleDateString('pt-BR') : null,
      dataTermino: reserva.dataTermino ? reserva.dataTermino.toLocaleDateString('pt-BR') : null,
      // horaInicio: reserva.horaInicio ? new Date(reserva.horaInicio).toLocaleTimeString('pt-BR', {timeZone: 'UTC'}) : null,
      // horaTermino: reserva.horaTermino ? new Date(reserva.horaTermino).toLocaleTimeString('pt-BR', {timeZone: 'UTC'}) : null
    };
    const dataAtual = new Date()
    const dataTerminoReserva = new Date(reservaObj.dataTermino + ' ' + reservaObj.horaTermino)
    reservaObj.terminou = dataTerminoReserva < dataAtual

    return reservaObj
  });

  res.render(resolveView('reservas-gerenciar'), {
    reservas: reservasJSON,
    nome: req.session.nome,
    csrfToken: req.csrfToken(),
    tipoUsuario: req.session.tipoUsuario
  })
}

const editar = async (req:Request, res: Response) => {
  if (req.method === 'GET') {
    try {
      const salas = await salasService.listarTodos()
      const reserva = await ReservaService.listarReservasDeUmUsuario(parseInt(req.session.uid!))
      
      if (!reserva) throw new Error('Reserva não encontrado!')
    
      res.render(resolveView('reservas-editar'), {
        // salas: salas.map((sala) => JSON.stringify(sala)),
        // salas: salas,
        // reserva: reserva.toJSON(),
        reserva: reserva,
        csrf: req.csrfToken(),
        // nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario
      })
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  } else if (req.method === 'POST') {
    if (req.body.dataTermino === '') {
      req.body.dataTermino = req.body.dataInicio
      req.body.dias = ''
    } else {
      if (typeof req.body.dia === 'string') {
        const dias = req.body.dia
        req.body.dias = dias
      } else if (req.body.dia) {
        const dias = req.body.dia.join(', ')
        req.body.dias = dias
        console.log(req.body.dias)
      } else {
        req.body.dias = ''
      }
    }

    const dados = {
      ...req.body,
      dataInicio: req.body.dataInicio ? `${req.body.dataInicio}T00:00:00.000Z` : undefined
    }

    try {
      // const reserva = await ReservaSala.update({
      //     ...req.body
      // }, { where: { id: req.params.id } });
      await ReservaService.atualizar(parseInt(req.params.id), dados)
      res.redirect('/reservas/gerenciar')
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  }
}

export default { adicionar, excluir, gerenciar, editar, listar }
