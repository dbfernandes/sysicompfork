import { Request, Response } from 'express';
import salasService from './salas.service';

const adicionar = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    res.render('salas/salas-adicionar', {
      nome: req.session.nome,
      csrf: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
    });
  } else if (req.method === 'POST') {
    try {
      const { andar, bloco, nome, numero, capacidade } = req.body;

      if (!andar || !bloco || !nome) {
        res.status(400).json({
          error: 'Dados incompletos ou mal formatados',
        });
        return;
      }

      const parsedNumero = parseInt(numero, 10) || 0;
      const parsedCapacidade = parseInt(capacidade, 10) || 0;

      await salasService.criar(
        nome,
        bloco,
        andar,
        parsedNumero,
        parsedCapacidade,
      );

      res.redirect('/salas/gerenciar');
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e });
    }
  }
};

const excluir = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const salaId = parseInt(id);
    const sala = await salasService.listarUm(salaId);
    if (!sala) {
      throw new Error('Sala não encontrada!');
    }

    await salasService.excluir(salaId);
    res.redirect('/salas/gerenciar');
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
};

const gerenciar = async (req: Request, res: Response): Promise<void> => {
  const salas = await salasService.listarTodos();
  res.render('salas/salas-gerenciar', {
    salas,
    csrfToken: req.csrfToken(),
    tipoUsuario: req.session.tipoUsuario,
  });
};

const editar = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    try {
      const { id } = req.params;
      const salaId = parseInt(id, 10);

      const sala = await salasService.listarUm(salaId);
      if (!sala) {
        res.status(404).send({ error: 'Sala não encontrada!' });
        return;
      }

      res.render('salas/salas-editar', {
        sala,
        csrf: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Unknown error' });
      }
    }
  } else if (req.method === 'POST') {
    try {
      const { id } = req.params;
      const salaId = parseInt(id, 10);
      await salasService.editar(salaId, req.body);
      res.redirect('/salas/gerenciar');
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Unknown error' });
      }
    }
  }
};

export default { adicionar, excluir, gerenciar, editar };
