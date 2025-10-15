import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import UsuarioService from '../usuarios/usuario.service';
import { formatNameSession } from '@utils/formatadores';

const optionsLogin = {
  layout: 'begin',
};
const autorizarAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.session.tipoUsuario?.administrador ||
    req.session.tipoUsuario?.secretaria
  )
    next();
  else return res.redirect('/');
};

const autorizarCoord = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.session.tipoUsuario?.administrador ||
    req.session.tipoUsuario?.secretaria ||
    req.session.tipoUsuario?.coordenador
  )
    next();
  else return res.redirect('/');
};

const autorizarProf = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.session.tipoUsuario?.administrador ||
    req.session.tipoUsuario?.secretaria ||
    req.session.tipoUsuario?.professor
  )
    next();
  else return res.redirect('/');
};

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const login = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    try {
      if (req.session.uid) return res.redirect('/');
      return res.status(StatusCodes.OK).render(resolveView('login'), {
        ...optionsLogin,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .render(resolveView('login'), {
          ...optionsLogin,
          message: 'Erro interno',
          type: 'danger',
        });
    }
  } else if (req.method === 'POST') {
    try {
      const { cpf, senha } = await req.body;
      const usuario = await UsuarioService.buscarUsuarioPor({ cpf });
      if (!usuario) {
        return res.status(StatusCodes.NOT_FOUND).render(resolveView('login'), {
          ...optionsLogin,

          message: 'Usuário não cadastrado',
          type: 'danger',
        });
      } else if (usuario.status === 0) {
        return res.status(StatusCodes.FORBIDDEN).render(resolveView('login'), {
          ...optionsLogin,
          message: 'Usuário bloqueado. Contate a administração.',
          type: 'danger',
        });
      }

      const isSenhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
      if (!isSenhaCorreta) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .render(resolveView('login'), {
            ...optionsLogin,
            message: 'Senha inválida',
            type: 'danger',
          });
      }

      req.session.uid = String(usuario.id);
      req.session.nome = formatNameSession(usuario.nomeCompleto);
      req.session.tipoUsuario = {
        administrador: usuario.administrador,
        coordenador: usuario.coordenador,
        secretaria: usuario.secretaria,
        professor: usuario.professor,
        diretor: usuario.diretor,
        professorPPGI: usuario.professorPPGI,
      };
      return res.status(StatusCodes.ACCEPTED).redirect('/inicio');
    } catch (err) {
      console.error(err);
      // return res.status(500).send({ message: 'Erro interno' });
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .render(resolveView('login'), {
          ...optionsLogin,
          message: 'Erro interno',
          type: 'danger',
        });
    }
  }
};

const recuperarSenha = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      return res.render(resolveView('recuperarSenha'), {
        ...optionsLogin,
      });
    }
    case 'POST': {
      const { email } = req.body;
      try {
        await UsuarioService.recuperarSenha({
          email,
          host: req.headers.host,
        });

        return res
          .status(200)
          .send({ message: 'Token enviado para o e-mail cadastrado' });
      } catch (err) {
        console.error(err);
        return res.render(resolveView('recuperarSenha'), {
          ...optionsLogin,
          message: 'Erro durante a recuperação de senha, tente novamente.',
          type: 'danger',
        });
      }
    }
    default:
      return res.status(405).send({ message: 'Método não permitido' });
  }
};

const trocaSenha = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      if (!req.query.token) return res.redirect('/login');
      const user = await UsuarioService.buscarUsuarioPor({
        tokenResetSenha: String(req.query.token),
      });
      const hasUser = Boolean(user);
      if (!hasUser) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .render(resolveView('trocarSenha'), {
            error: 'Token invalido',
            ...optionsLogin,
          });
      }

      const isTokenValid = user.validadeTokenResetSenha > new Date();
      if (!isTokenValid) {
        return res
          .status(StatusCodes.FAILED_DEPENDENCY)
          .render(resolveView('trocarSenha'), {
            error: 'Token expirado',
            ...optionsLogin,
          });
      }

      return res.status(StatusCodes.OK).render(resolveView('trocarSenha'), {
        nome: user.nomeCompleto,
        token: req.query.token,
        ...optionsLogin,
      });
    }
    case 'PUT': {
      const { password, token } = req.body;
      try {
        if (!password || !token) {
          return res.status(StatusCodes.BAD_REQUEST).send();
        }
        await UsuarioService.mudarSenhaComToken({
          password,
          token,
        });

        return res.status(StatusCodes.OK).send();
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: err.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }
    }
    default:
      return res
        .status(StatusCodes.FORBIDDEN)
        .send({ message: 'Método não permitido' });
  }
};

const logout = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
        return;
      }
      res.redirect('/login');
    });
  }
};

const verificar = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.uid) return res.redirect('/login');
  next();
};

export default {
  autorizarAdmin,
  autorizarCoord,
  autorizarProf,
  login,
  logout,
  recuperarSenha,
  verificar,
  trocaSenha,
};
