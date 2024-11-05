import { Request, Response } from 'express';
import SalaService from './sala.service';
import path from 'path';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const adicionar = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    res.render(resolveView('salas-adicionar'), {
      nome: req.session.nome,
      csrf: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
    });
  } else if (req.method === 'POST') {
    try {
      let { andar, bloco, nome, numero, capacidade } = req.body;

      if (!andar || !bloco || !nome) {
        res.status(400).json({
          error: 'Dados incompletos ou mal formatados',
        });
        return;
      }
      // numero = parseInt(numero & numero == ''? 0 : req.body.numero,10)
      numero = parseInt(req.body.numero, 10) || 0;
      // capacidade = parseInt(capacidade & capacidade== ''? 0 : req.body.capacidade,10)
      capacidade = parseInt(req.body.capacidade, 10) || 0;
      const sala = {
        andar,
        bloco,
        nome,
        numero,
        capacidade,
      };
      await SalaService.criar(sala);
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
    const sala = await SalaService.listarUmaSala(salaId);
    if (!sala) {
      throw new Error('Sala não encontrada!');
    }

    await SalaService.excluir(salaId);
    res.redirect('/salas/gerenciar');
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
};

const gerenciar = async (req: Request, res: Response): Promise<void> => {
  const salas = await SalaService.listarTodos();
  res.render(resolveView('salas-gerenciar'), {
    salas,
    csrfToken: req.csrfToken(),
    tipoUsuario: req.session.tipoUsuario,
  });
};

const editar = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    try {
      const sala = await SalaService.listarUmaSala(parseInt(req.params.id));
      res.render(resolveView('salas-editar'), {
        sala: sala,
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
      const sala = {
        andar: req.body.andar,
        bloco: req.body.bloco,
        nome: req.body.nome,
        numero: parseInt(req.body.numero, 10),
        capacidade: parseInt(req.body.capacidade, 10),
      };
      await SalaService.editar(parseInt(req.params.id), sala);
      res.redirect('/salas/gerenciar');
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  }
};

export default { adicionar, excluir, gerenciar, editar };
