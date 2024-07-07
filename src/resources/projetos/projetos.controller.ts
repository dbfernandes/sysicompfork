// Rota desativada - funcionalidade removida

import { Request, Response } from 'express';
import path from 'path';
function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const adicionar = (req: Request, res: Response): any => {
  if (req.method === 'GET') {
    res.render(resolveView('projetos-adicionar'), {
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } else {
    console.log('cadastrar no banco');
  }
};

const listar = (req: Request, res: Response): any => {
  res.render(resolveView('projetos-listar'), {
    nome: req.session.nome,
    tipoUsuario: req.session.tipoUsuario,
  });
};

export default { adicionar, listar };
