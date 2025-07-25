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
