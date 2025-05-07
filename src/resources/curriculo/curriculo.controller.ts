import { Request, Response } from 'express';
import AvatarService from '../avatar/avatar.service';
import PublicacaoService from '../publicacao/publicacao.service';
import PremioService from '../premio/premio.service';
import UsuarioService from '../usuarios/usuario.service';
import ProjetoService from '../projetos/projetos.service';
import OrientacaoService from '../orientacao/orientacao.service';
import criarURL from '../../utils/criarUrl';
import path from 'path';
import upload from '../../middlewares/multer.config';
import {
  InfoParsed,
  OrientacaoParsed,
  PremioParsed,
  ProjetoParsed,
  ProjetoTransformed,
  PublicacaoParsed,
} from '../projetos/projetos.types';
import { UploadRequest } from './curriculo.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const visualizarCurriculo = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const professores = await UsuarioService.listarTodosPorCondicao({
          professor: 1,
          status: 1,
        });
        return res.render(resolveView('curriculoAdicionar'), {
          professores,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          usuarioId: req.session.uid,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
          avatar: null,
        });
      } catch (error) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/inicio', {
            message: 'Não foi possível abrir o envio de currículo.',
            type: 'danger',
            messageTitle: 'Envio de currículo indisponível!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
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

const carregar = (req: UploadRequest, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Erro no upload:', err);
      return res.status(500).json({
        error: 'Erro ao processar upload do arquivo',
      });
    }

    try {
      const { publicacoes, professorId, premios, info, projetos, orientacoes } =
        req.body;

      // Parse dos dados com tipos específicos
      const publicacoesParsed = JSON.parse(publicacoes) as PublicacaoParsed[];
      const premiosParsed = JSON.parse(premios) as PremioParsed[];
      const infoParsed = JSON.parse(info) as InfoParsed;
      const projetosParsed = JSON.parse(projetos) as ProjetoParsed[];
      const orientacoesParsed = JSON.parse(orientacoes) as OrientacaoParsed[];

      // Transformação dos projetos para o formato esperado pelo service
      const projetosTransformed: ProjetoTransformed = {
        projetos: projetosParsed.map((p) => ({
          titulo: p.titulo || '',
          descricao: p.descricao || '',
          papel: p.papel || '',
          financiadores: p.financiadores || '',
          integrantes: p.integrantes || '',
          inicio: p.inicio || 0,
          fim: p.fim || 0,
        })),
      };

      // Chamadas aos services com validação de tipos
      await Promise.all([
        OrientacaoService.adicionarVarios(professorId, orientacoesParsed),
        ProjetoService.adicionarVarios(professorId, projetosTransformed),
        UsuarioService.alterarInfo(professorId, infoParsed),
        PremioService.adicionarVarios(professorId, premiosParsed),
        PublicacaoService.adicionarVarios(professorId, publicacoesParsed),
      ]);

      // Upload do avatar se existir
      if (req.file) {
        await AvatarService.adicionarAvatar(
          professorId,
          req.file.filename,
          req.file.path,
        );
      }

      return res.status(201).json({
        message: 'Currículo atualizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao processar currículo:', error);
      return res.status(500).json({
        error: 'Erro interno ao processar currículo',
      });
    }
  });
};

export default { visualizarCurriculo, verificarAvatar, carregar };
