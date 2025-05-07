// Rota desativada - funcionalidade removida

import { Request, Response } from 'express';
import path from 'path';
function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const criarProjetos = (req: Request, res: Response): any => {
  if (req.method === 'GET') {
    res.render(resolveView('projetosAdicionar'), {
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } else {
    console.log('cadastrar no banco');
  }
};

const listarProjetos = (req: Request, res: Response): any => {
  res.render(resolveView('projetosListar'), {
    nome: req.session.nome,
    tipoUsuario: req.session.tipoUsuario,
  });
};

export default { criarProjetos, listarProjetos };
