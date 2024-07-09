import { Request, Response, NextFunction } from 'express';

const isUsuarioAutenticado = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rotasSemAutenticacao = ['/login', '/logout'];
  if (rotasSemAutenticacao.includes(req.path)) {
    return next();
  }
  if (req.session.uid) {
    return next();
  }

  return res.redirect('/login');
};

export default isUsuarioAutenticado;
