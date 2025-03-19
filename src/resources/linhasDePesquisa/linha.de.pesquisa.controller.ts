import { Request, Response } from 'express';
import linhasDePesquisaService from './linha.de.pesquisa.service';
import {
  CreateLinhaDePesquisaDto,
  UpdateLinhaDePesquisaDto,
} from './linha.de.pesquisa.types';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
const pageTitle = 'Linhas De Pesquisa';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Lista todas as linhas de pesquisa
const listar = async (req: Request, res: Response) => {
  try {
    const linhasDePesquisa = await linhasDePesquisaService.listarTodos();

    if (!linhasDePesquisa || linhasDePesquisa.length === 0) {
      throw new Error('Nenhuma linha de pesquisa cadastrada');
    }

    return res
      .status(StatusCodes.OK)
      .render(resolveView('linhasDePesquisa-listar'), {
        linhaDePesquisa: linhasDePesquisa,
        pageTitle,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session?.tipoUsuario,
      });
  } catch (erro) {
    console.error(
      `[ERRO] Listar linhas de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
    );
    return res
      .status(StatusCodes.BAD_REQUEST)
      .render(resolveView('linhasDePesquisa-listar'), {
        pageTitle,
        erro:
          erro instanceof Error
            ? erro.message
            : 'Não foi possível listar as linhas de pesquisa!',
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session?.tipoUsuario,
      });
  }
};

// Busca detalhes de uma linha de pesquisa
const detalhar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const linhaPesquisa = await linhasDePesquisaService.buscarPorId(
      parseInt(id),
    );

    if (!linhaPesquisa) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ mensagem: 'Linha de Pesquisa não encontrada!' });
    }

    const { nome, sigla } = linhaPesquisa;

    return res
      .status(StatusCodes.OK)
      .render(resolveView('linhasDePesquisa-busca'), {
        nomePesquisa: nome, // Renomeado para evitar duplicação
        sigla,
        pageTitle,
        tipoUsuario: req.session?.tipoUsuario,
        nome: req.session.nome, // Nome do usuário logado
      });
  } catch (erro) {
    console.error(
      `[ERRO] Detalhar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ mensagem: 'Erro ao buscar linha de pesquisa!' });
  }
};

// Cria uma nova linha de pesquisa
const criar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res
      .status(StatusCodes.OK)
      .render(resolveView('linhasDePesquisa-criar'), {
        pageTitle,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
        nome: req.session.nome,
      });
  } else if (req.method === 'POST') {
    try {
      const novaLinhaPesquisa: CreateLinhaDePesquisaDto = {
        nome: req.body.nome,
        sigla: req.body.sigla,
      };

      // Verificação de existência
      const existenteNome = await linhasDePesquisaService.buscarPorNome(
        novaLinhaPesquisa.nome,
      );
      if (existenteNome) {
        throw new Error('Linha de Pesquisa já cadastrada!');
      }

      const existenteSigla = await linhasDePesquisaService.buscarPorSigla(
        novaLinhaPesquisa.sigla,
      );
      if (existenteSigla) {
        throw new Error('Sigla já cadastrada!');
      }

      await linhasDePesquisaService.criar(novaLinhaPesquisa);
      return res
        .status(StatusCodes.CREATED)
        .redirect('/linhasDePesquisa/listar');
    } catch (erro) {
      console.error(
        `[ERRO] Criar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .render(resolveView('linhasDePesquisa-criar'), {
          pageTitle,
          nome: req.session.nome,
          csrfToken: req.csrfToken(),
          tipoUsuario: req.session?.tipoUsuario,
          erro:
            erro instanceof Error
              ? erro.message
              : 'Não foi possível criar a linha de pesquisa!',
        });
    }
  }
};

// Remove uma linha de pesquisa
const excluir = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      await linhasDePesquisaService.excluir(parseInt(req.params.id));
      return res.redirect('/linhasDePesquisa/listar');
    } catch (erro) {
      console.error(
        `[ERRO] Excluir linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      return res.render(resolveView('linhasDePesquisa-listar'), {
        pageTitle,
        erro:
          erro instanceof Error
            ? erro.message
            : 'Não foi possível remover a linha de pesquisa!',
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
      });
    }
  }
};

// Edita uma linha de pesquisa existente
const editar = async (req: Request, res: Response) => {
  let linhaPesquisa; // Declaração fora do bloco try para acesso no catch

  try {
    linhaPesquisa = await linhasDePesquisaService.buscarPorId(
      parseInt(req.params.id),
    );

    if (!linhaPesquisa) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .render(resolveView('linhasDePesquisa-listar'), {
          pageTitle,
          erro: 'Linha de pesquisa não encontrada!',
          nome: req.session.nome,
          csrfToken: req.csrfToken(),
          tipoUsuario: req.session?.tipoUsuario,
        });
    }

    if (req.method === 'GET') {
      return res
        .status(StatusCodes.OK)
        .render(resolveView('linhasDePesquisa-editar'), {
          linhaPesquisa,
          pageTitle,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          tipoUsuario: req.session?.tipoUsuario,
        });
    } else if (req.method === 'POST') {
      const dadosAtualizados: UpdateLinhaDePesquisaDto = {
        nome: req.body.nome,
        sigla: req.body.sigla,
      };

      // Verificação de existência
      const existenteNome = await linhasDePesquisaService.buscarPorNome(
        dadosAtualizados.nome,
      );
      if (existenteNome && existenteNome.id !== parseInt(req.params.id)) {
        throw new Error('Linha de Pesquisa já cadastrada!');
      }

      const existenteSigla = await linhasDePesquisaService.buscarPorSigla(
        dadosAtualizados.sigla,
      );
      if (existenteSigla && existenteSigla.id !== parseInt(req.params.id)) {
        throw new Error('Sigla já cadastrada!');
      }

      await linhasDePesquisaService.atualizar(
        parseInt(req.params.id),
        dadosAtualizados,
      );
      return res.redirect('/linhasDePesquisa/listar');
    }
  } catch (erro) {
    console.error(
      `[ERRO] Editar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
    );
    return res
      .status(StatusCodes.BAD_REQUEST)
      .render(resolveView('linhasDePesquisa-editar'), {
        pageTitle,
        linhaPesquisa, // Agora está definido no escopo
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
        erro:
          erro instanceof Error
            ? erro.message
            : 'Não foi possível editar a linha de pesquisa!',
      });
  }
};

export default { listar, detalhar, criar, excluir, editar };
