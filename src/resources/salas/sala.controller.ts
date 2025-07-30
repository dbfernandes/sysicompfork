import { Request, Response } from 'express';
import SalaService from './sala.service';
import path from 'path';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const criarSala = async (req: Request, res: Response): Promise<void> => {
  if (req.method === 'GET') {
    if (!req.session.tipoUsuario?.professor) {
      res.status(401).send('Não autorizado');
      return;
    }

    res.render(resolveView('salasAdicionar'), {
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } else if (req.method === 'POST') {
    try {
      if (!req.session.tipoUsuario?.professor) {
        res.status(401).send('Não autorizado');
        return;
      }

      let { andar, bloco, nome, numero, capacidade } = req.body;

      if (!andar || !bloco || !nome) {
        res.status(400).json({
          error: 'Dados incompletos ou mal formatados',
        });
        return;
      }

      numero = parseInt(req.body.numero, 10) || 0;
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
      res.status(400).json({ error: e });
    }
  }
};

const excluirSala = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.tipoUsuario?.professor) {
    res.status(401).send('não encontrada');
    return;
  }

  const { id } = req.params;
  try {
    const salaId = parseInt(id);
    const sala = await SalaService.listarUmaSala(salaId);

    if (!sala) {
      res.status(404).json({ error: 'Sala não encontrada!' });
      return;
    }

    await SalaService.excluir(salaId);
    res.redirect('/salas/gerenciar');
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
};

const listarSalas = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.tipoUsuario?.professor) {
    res.status(401).send('Não autorizado');
    return;
  }

  const salas = await SalaService.listarTodos();
  res.render(resolveView('salasGerenciar'), {
    salas,
    nome: req.session.nome,
    tipoUsuario: req.session.tipoUsuario,
  });
};

const editarSala = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.tipoUsuario?.professor) {
    res.status(401).send('Não autorizado');
    return;
  }

  if (req.method === 'GET') {
    try {
      const sala = await SalaService.listarUmaSala(parseInt(req.params.id));

      if (!sala) {
        res.status(404).send({ message: 'Sala não encontrada' });
        return;
      }

      res.render(resolveView('salasEditar'), {
        sala: sala,
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(404).send({ message: error.message });
      } else {
        res.status(404).send({ message: 'Unknown error' });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body.nome) {
        res.status(400).json({ error: 'Nome é obrigatório' });
        return;
      }
      const salaFind = await SalaService.listarUmaSala(parseInt(req.params.id));
      if (!salaFind) {
        res.status(404).json({ error: 'Sala não encontrada' });
        return;
      }
      const sala = {
        andar: req.body.andar,
        bloco: req.body.bloco,
        nome: req.body.nome,
        numero: parseInt(req.body.numero, 10) || 0,
        capacidade: parseInt(req.body.capacidade, 10) || 0,
      };

      await SalaService.editar(parseInt(req.params.id), sala);

      res.redirect('/salas/gerenciar');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export default { criarSala, excluirSala, listarSalas, editarSala };
