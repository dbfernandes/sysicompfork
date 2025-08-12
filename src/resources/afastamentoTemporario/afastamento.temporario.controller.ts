import { Request, Response } from 'express';
import afastamentoService from './afastamento.temporario.service';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { CreateAfastamentoDTO } from './afastamento.temporario.types';
import usuarioService from '@resources/usuarios/usuario.service';
const pageTitle = 'Afastamento Temporário';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listarAfastamentos = async (req: Request, res: Response) => {
  try {
    let afastamentos;

    if (req.session.tipoUsuario?.administrador) {
      const afastamentos = await afastamentoService.listarTodos();
      const doesNotExists = !afastamentos || afastamentos.length === 0;
      if (doesNotExists)
        throw new Error('Nenhum pedido de afastamento encontrado');
      return res
        .status(StatusCodes.OK)
        .render(resolveView('listarAfastamento'), {
          afastamentos,
          pageTitle,
          nome: req.session.nome,
          tipoUsuario: req.session.tipoUsuario,
        });
    } else {
      afastamentos = await afastamentoService.listarPorUsuario(
        Number(req.session.uid!),
      );
    }

    if (!afastamentos || afastamentos.length === 0) {
      throw new Error('Nenhum pedido de afastamento encontrado');
    }

    return res.status(StatusCodes.OK).render(resolveView('listarAfastamento'), {
      afastamentos,
      pageTitle,
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (erro) {
    console.error(
      `[ERRO] Listar afastamentos: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render(resolveView('listarAfastamento'), {
        pageTitle,
        tipoUsuario: req.session.tipoUsuario,
        nome: req.session.nome,
        erro:
          erro instanceof Error
            ? erro.message
            : 'Não foi possível listar os pedidos de afastamento!',
      });
  }
};

export const adicionarAfastamento = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res
      .status(StatusCodes.OK)
      .render(resolveView('solicitarAfastamento'), {
        pageTitle,
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
      });
  } else {
    const { uid, nome } = req.session;
    const {
      dataSaida,
      dataRetorno,
      tipoViagem,
      localViagem,
      justificativa,
      planoReposicao,
    } = req.body;

    const novoAfastamento: CreateAfastamentoDTO = {
      usuarioId: Number(uid),
      nomeCompleto: nome!,
      dataInicio: new Date(dataSaida),
      dataFim: new Date(dataRetorno),
      tipoViagem: String(tipoViagem),
      localViagem: String(localViagem),
      justificativa: String(justificativa),
      planoReposicao: String(planoReposicao),
    };

    await afastamentoService.criar(novoAfastamento);

    return res.status(StatusCodes.OK).redirect('/afastamentoTemporario/listar');
  }
};

const exibirDetalhes = async (req: Request, res: Response) => {
  try {
    const afastamento = await afastamentoService.buscarDetalhesPorId(
      Number(req.params.id),
    );
    if (!afastamento)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Pedido de afastamento não encontrado' });
    return res
      .status(StatusCodes.OK)
      .render(resolveView('visualizarAfastamento'), {
        afastamento,
        pageTitle,
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
      });
  } catch (error: unknown) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render(resolveView('listarAfastamento'), {
        pageTitle,
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível visualizar o pedido de afastamento!',
      });
  }
};

const removerAfastamento = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      await afastamentoService.excluir(Number(req.params.id));
      return res.redirect('/afastamentoTemporario/listar');
    } catch (error: unknown) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .render(resolveView('listarAfastamento'), {
          pageTitle,
          nome: req.session.nome,
          tipoUsuario: req.session.tipoUsuario,
        });
    }
  }
};

export default {
  adicionarAfastamento,
  listarAfastamentos,
  exibirDetalhes,
  removerAfastamento,
};
