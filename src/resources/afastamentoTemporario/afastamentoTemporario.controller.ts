import { Request, Response } from 'express';
import afastamentoService from './afastamentoTemporario.service';
import path from 'path';
import { CreateAfastamentoDTO } from './afastamentoTemporario.types';
const pageTitle = 'Afastamento Temporário';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listar = async (req: Request, res: Response) => {
  try {
    if (req.session.tipoUsuario?.administrador) {
      console.log('Acessando como Administrador');
      const afastamentos = await afastamentoService.listarTodos();
      const doesNotExists = !afastamentos || afastamentos.length === 0;
      if (doesNotExists)
        throw new Error('Nenhum pedido de afastamento encontrado');

      return res.status(200).render(resolveView('pedidos-afastamento'), {
        afastamentos,
        pageTitle,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
      });
    } else {
      console.log('Acessando como Usuário');
      const afastamentos = await afastamentoService.listarAfastamentosDoUsuario(
        Number(req.session.uid!),
      );
      const doesNotExists = !afastamentos || afastamentos.length === 0;
      if (doesNotExists)
        throw new Error('Nenhum pedido de afastamento encontrado');

      return res.status(200).render(resolveView('pedidos-afastamento'), {
        afastamentos,
        pageTitle,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
  } catch (error: unknown) {
    return res.render(resolveView('pedidos-afastamento'), {
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
      nome: req.session.nome,
      error:
        error instanceof Error
          ? error.message
          : 'Não foi possível listar os pedidos de afastamento!',
    });
  }
};

export const criar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.status(200).render(resolveView('solicitar-afastamento'), {
      pageTitle,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } else {
    try {
      const { uid, nome } = req.session
      const {
        dataInicio,
        dataFim,
        tipoViagem,
        localViagem,
        justificativa,
        planoReposicao
      } = req.body
      const afastamento = {
        usuarioId: Number(uid),
        nomeCompleto: nome!,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        tipoViagem,
        localViagem,
        justificativa,
        planoReposicao
      }
      await afastamentoService.criar(afastamento)
    } catch (error: any) {
      return res.render(resolveView('solicitar-afastamento'), {
        pageTitle,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
        error:
          error.message || 'Não foi possível criar o pedido de afastamento!',
      });
    }
  }

  try {
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
      nomeCompleto: nome!, // nome do usuário da sessão
      dataInicio: new Date(dataSaida),
      dataFim: new Date(dataRetorno),
      tipoViagem: String(tipoViagem),
      localViagem: String(localViagem),
      justificativa: String(justificativa),
      planoReposicao: String(planoReposicao),
    };

    await afastamentoService.criar(novoAfastamento);
    return res.redirect('/afastamentoTemporario/listar');
  } catch (error: unknown) {
    return res.render(resolveView('solicitar-afastamento'), {
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
      error:
        error instanceof Error
          ? error.message
          : 'Não foi possível criar o pedido de afastamento!',
    });
  }
};

const vizualizar = async (req: Request, res: Response) => {
  try {
    const afastamento = await afastamentoService.vizualizar(
      Number(req.params.id),
    );
    if (!afastamento)
      return res
        .status(400)
        .json({ message: 'Pedido de afastamento não encontrado' });
    return res.render(resolveView('vizualizar-afastamento'), {
      afastamento,
      pageTitle,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (error: unknown) {
    return res.render(resolveView('pedidos-afastamento'), {
      pageTitle,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario,
      error:
        error instanceof Error
          ? error.message
          : 'Não foi possível visualizar o pedido de afastamento!',
    });
  }
};

const remover = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      await afastamentoService.delete(Number(req.params.id));
      return res.redirect('/afastamentoTemporario/listar');
    } catch (error: unknown) {
      return res.render(resolveView('pedidos-afastamento'), {
        pageTitle,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível remover o pedido de afastamento!',
      });
    }
  }
};

export default { criar, listar, vizualizar, remover };
