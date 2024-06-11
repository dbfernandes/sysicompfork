import { Request, Response } from 'express';
import AvatarService from '../services/avatarService';
import PublicacaoService from '../services/publicacaoService';
import PremioService from '../services/premioService';
import UsuarioService from '../services/usuarioService';
import ProjetoService from '../services/projetoService';
import OrientacaoService from '../services/orientacaoService';
import criarURL from '../utils/criarUrl';

interface SessionData {
  tipoUsuario?: {
    administrador: boolean;
    secretaria: boolean;
    coordenador: boolean;
    professor: boolean;
  } | undefined;
  uid: string;
  nome: string;
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
        return res.render('curriculo/curriculo-adicionar', {
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
          await AvatarService.adicionar(idProfessor, req.file.filename, req.file.path);
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
