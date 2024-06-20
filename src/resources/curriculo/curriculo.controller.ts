import { Request, Response } from 'express';
import { CreateAvatarDto } from '../avatar/avatar.types';

import AvatarService from '../avatar/avatar.service';
import PublicacaoService from '../publicacao/publicacao.service';
import PremioService from '../premio/premio.service';
import UsuarioService from '../usuarios/usuario.service';
import ProjetoService from '../projetos/projetos.service';
import OrientacaoService from '../orientacao/orientacao.service'
import criarURL from '../../utils/criarUrl';
import path from 'path';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const visualizar = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const professores = await UsuarioService.listarTodosPorCondicao({
          professor: 1,
          status: 1
        });
        return res.render(resolveView('curriculo-adicionar'), {
          professores,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          usuarioId: req.session.uid,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
          avatar: null
        });
      } catch (error) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/inicio', {
            message: 'Não foi possível abrir o envio de currículo.',
            type: 'danger',
            messageTitle: 'Envio de currículo indisponível!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const verificarAvatar = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.params;
        const avatar = await AvatarService.listarUmAvatar(parseInt(id));
        return res.status(200).send(avatar);
      } catch (err) {
        return res.status(500).send();
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const carregar = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'POST':
      try {
        const { publicacoes, idProfessor, premios, info, projetos, orientacoes } = req.body;
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
          const avatar: CreateAvatarDto = {
            idUsuario: idProfessor,
            nome: req.file.filename,
            caminho: req.file.path
          };
          await AvatarService.adicionar(avatar);
        }
        return res.status(201).send();
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

export default { visualizar, verificarAvatar, carregar };
