import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.uid || !req.session.tipoUsuario)
    return res.redirect('/login');
  next();
};

export const isAuthSelecao = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.uid)
    return res.status(StatusCodes.UNAUTHORIZED).redirect('/');
  next();
};

const isUsuarioAutenticado = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const paths = req.path.split('/');
  const isSelecaoPPGI =
    paths.includes('selecaoPPGI') || paths.includes('selecaoppgi');

  const rotasSemAutenticacao = [
    '/login',
    '/logout',
    '/recuperarSenha',
    '/alterarSenha',
    '/trocarSenha',
  ];

  if (isSelecaoPPGI || rotasSemAutenticacao.includes(req.path)) {
    return next();
  }
  if (req.session.uid) {
    return next();
  }

  return res.redirect('/login');
};

export const isUsuarioAutenticadoSelecao = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rotasSemAutenticacao = [
    '/',
    '/entrar',
    '/cadastro',
    '/recuperarSenha',
    '/trocarSenha',
  ];
  if (rotasSemAutenticacao.includes(req.path)) {
    return next();
  }
  if (req.session.uid) {
    return next();
  }
  return res.redirect('/selecaoPPGI');
};

export default isUsuarioAutenticado;
