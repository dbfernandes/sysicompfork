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

export const isAuthSelecao = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.uid) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao destruir a sessão:', err);
      }
    });
    if (req.method === 'GET') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .redirect('/entrar?expired=true');
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'unauthorized',
        message: 'Sessão expirada ou inválida',
      });
    }
  }

  next();
};
