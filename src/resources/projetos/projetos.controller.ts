// Rota desativada - funcionalidade removida

import { Request, Response } from 'express';

const adicionar = (req: Request, res: Response): any => {
  if (req.method === 'GET') {
    res.render('projetos/projetos-adicionar', {
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } else {
    console.log('cadastrar no banco');
  }
};

const listar = (req: Request, res: Response): any => {
  res.render('projetos/projetos-listar', {
    nome: req.session.nome,
    tipoUsuario: req.session.tipoUsuario,
  });
};

export default { adicionar, listar };
