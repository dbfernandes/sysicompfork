import { NextFunction, Request, Response } from 'express';
import usuarioService from '../usuarios/usuario.service';
import criarURL from '../../utils/criarUrl';
import path from 'path';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ChangePasswordBodyDto } from '@resources/usuarios/usuario.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const exibirDetalhes = async (req: Request, res: Response) => {
  try {
    const { message, type, messageTitle } = req.query;
    const id = req.session.uid;
    const usuario = await usuarioService.listarUmUsuario(parseInt(id!));
    return res.render(resolveView('perfilDados'), {
      usuario,
      nome: req.session.nome,
      message,
      type,
      messageTitle,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).redirect(
      criarURL('/inicio', {
        message: 'Não foi possível visualizar o seu perfil.',
        type: 'danger',
        messageTitle: 'Visualização do perfil indisponível!',
        tipoUsuario: req.session.tipoUsuario,
      }),
    );
  }
};

const deletar = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      const id = req.session.uid;
      await usuarioService.alterar(parseInt(id!), { status: 0 });
      req.session.uid = undefined;
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return res.status(503).redirect(
        criarURL('/perfil', {
          messageTitle: 'Bloqueio de perfil indisponível!',
          message: 'Não foi possível bloquear o seu perfil.',
          type: 'danger',
          tipoUsuario: req.session.tipoUsuario,
        }),
      );
    }
  } else {
    return res
      .status(400)
      .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const editarSenha = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST') {
    const id = req.session.uid;
    const { currentPassword, newPassword } = req.body as ChangePasswordBodyDto;
    try {
      await usuarioService.changePassword({
        userId: parseInt(id!),
        currentPassword,
        newPassword,
      });
      res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch (error) {
      next(error);
    }
  } else {
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .send(ReasonPhrases.METHOD_NOT_ALLOWED);
  }
};

export default { exibirDetalhes, deletar, editarSenha };
