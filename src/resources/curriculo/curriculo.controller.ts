import { NextFunction, Request, Response } from 'express';
import AvatarService from '../avatar/avatar.service';
import PublicacaoService from '../publicacao/publicacao.service';
import PremioService from '../premio/premio.service';
import UsuarioService from '../usuarios/usuario.service';
import ProjetoService from '../projetos/projetos.service';
import OrientacaoService from '../orientacao/orientacao.service';
import criarURL from '../../utils/criarUrl';
import path from 'path';
import upload from './curriculo.multer';
import {
  InfoParsed,
  OrientacaoParsed,
  PremioParsed,
  ProjetoParsed,
  ProjetoTransformed,
  PublicacaoParsed,
} from '../projetos/projetos.types';
import CurriculoService from '@resources/curriculo/curriculo.service';
import gerarPlanilhaNumerosLattes from '@utils/gerarPlanilha/gerarPlanilhaLattes';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}
async function viewData(req: Request, res: Response) {
  try {
    const { message, type, messageTitle } = req.query;
    const data = await CurriculoService.getAcompanhamentoLattes();
    return res.render(resolveView('curriculoNumeros'), {
      ...data,
      nome: req.session.nome,
      usuarioId: req.session.uid,
      message,
      type,
      messageTitle,
      tipoUsuario: req.session.tipoUsuario,
      avatar: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).redirect(
      criarURL('/inicio', {
        message: 'Não foi possível abrir o envio de currículo.',
        type: 'danger',
        messageTitle: 'Envio de currículo indisponível!',
        tipoUsuario: req.session.tipoUsuario,
      }),
    );
  }
}
const visualizarCurriculo = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const professores = await UsuarioService.listarTodosPorCondicao({
          professor: 1,
        });
        return res.render(resolveView('curriculoAdicionar'), {
          professores,
          nome: req.session.nome,
          usuarioId: req.session.uid,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
          avatar: null,
        });
      } catch (error) {
        console.error(error);
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

const verificarAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const avatar = await AvatarService.listarUmAvatar(parseInt(id));
    return res.status(200).send(avatar);
  } catch (err) {
    next(err);
  }
};

const carregar = (req, res: Response, next: NextFunction) => {
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
      const professorIdParsed = Number(professorId);
      // Parse dos dados com tipos específicos
      const publicacoesParsed = JSON.parse(publicacoes) as PublicacaoParsed[];
      const premiosParsed = JSON.parse(premios).premios as PremioParsed[];
      const infoParsed = JSON.parse(info) as InfoParsed;
      const projetosParsed = JSON.parse(projetos).projetos as ProjetoParsed[];
      const orientacoesParsed = JSON.parse(orientacoes)
        .orientacoes as OrientacaoParsed[];

      // const curriculoFile = req.files?.curriculoXML?.[0];

      // if (curriculoFile) {
      //   const xmlPath = curriculoFile.path;
      //   await CurriculoService.importarLattes(xmlPath, professorIdParsed);
      // }

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
        OrientacaoService.adicionarVarios(professorIdParsed, orientacoesParsed),
        ProjetoService.adicionarVarios(professorIdParsed, projetosTransformed),
        UsuarioService.alterarInfo(professorIdParsed, infoParsed),
        PremioService.adicionarVarios(professorIdParsed, premiosParsed),
        PublicacaoService.adicionarVarios(professorIdParsed, publicacoesParsed),
      ]);
      if (req.files && req.files.file && req.files.file.length > 0) {
        const fileUpload = req.files.file[0];
        await AvatarService.adicionarAvatar(
          professorIdParsed,
          fileUpload.originalname,
          fileUpload.path,
        );
      }

      return res.status(201).json({
        message: 'Currículo atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  });
};

const geraPlanilha = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buffer = await gerarPlanilhaNumerosLattes();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="numeros-lattes.xlsx"',
    );
    res.end(buffer);
  } catch (error) {
    next(error);
  }
};

export default {
  visualizarCurriculo,
  verificarAvatar,
  viewData,
  carregar,
  geraPlanilha,
};
