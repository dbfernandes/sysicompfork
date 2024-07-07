// src/modules/curriculo/curriculo.controller.ts
import { Request, Response } from 'express';
import { CreateAvatarDto } from '../avatar/avatar.types';

import AvatarService from '../avatar/avatar.service';
import PublicacaoService from '../publicacao/publicacao.service';
import PremioService from '../premio/premio.service';
import UsuarioService from '../usuarios/usuario.service';
import ProjetoService from '../projetos/projetos.service';
import OrientacaoService from '../orientacao/orientacao.service';
import criarURL from '../../utils/criarUrl';
import path from 'path';
import upload from '../../middlewares/multer.config';

interface SessionData {
  tipoUsuario?:
    | {
        administrador: boolean;
        secretaria: boolean;
        coordenador: boolean;
        professor: boolean;
      }
    | undefined;
  uid: string;
  nome: string;
}

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const visualizar = async (req: Request, res: Response) => {
  try {
    const { message, type, messageTitle } = req.query;
    const professores = await UsuarioService.listarTodosPorCondicao({
      professor: 1,
      status: 1,
    });
    return res.render(resolveView('curriculo-adicionar'), {
      professores,
      csrfToken: req.csrfToken(),
      nome: (req.session as SessionData).nome,
      usuarioId: (req.session as SessionData).uid,
      message,
      type,
      messageTitle,
      tipoUsuario: (req.session as SessionData).tipoUsuario,
      avatar: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).redirect(
      criarURL('/inicio', {
        message: 'Não foi possível abrir o envio de currículo.',
        type: 'danger',
        messageTitle: 'Envio de currículo indisponível!',
        tipoUsuario: (req.session as SessionData).tipoUsuario,
      }),
    );
  }
};

const verificarAvatar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const avatar = await AvatarService.listarUmAvatar(parseInt(id));
    return res.status(200).send(avatar);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

const carregar = (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    try {
      const { publicacoes, idProfessor, premios, info, projetos, orientacoes } =
        req.body;
      const publicacoesParsed = JSON.parse(publicacoes);
      const premiosParsed = JSON.parse(premios);
      const infoParsed = JSON.parse(info);
      const projetosParsed = JSON.parse(projetos);
      const orientacoesParsed = JSON.parse(orientacoes);

      await OrientacaoService.adicionarVarios(idProfessor, orientacoesParsed);
      await ProjetoService.adicionarVarios(idProfessor, projetosParsed);
      await UsuarioService.alterarInfo(idProfessor, infoParsed);
      await PremioService.adicionarVarios(idProfessor, premiosParsed);
      await PublicacaoService.adicionarVarios(idProfessor, publicacoesParsed);
      if (req.file) {
        await AvatarService.adicionar(
          idProfessor,
          req.file.filename,
          req.file.path,
        );
      }
      return res.status(201).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  });
};

export default { visualizar, verificarAvatar, carregar };
