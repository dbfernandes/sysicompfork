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

const listar = async (req: Request, res: Response) => {
  try {
    const linhaDePesquisa = await linhasDePesquisaService.list();
    const doesNotExists = !linhaDePesquisa || linhaDePesquisa.length === 0;

    if (doesNotExists) throw new Error('Nenhuma linha de pesquisa cadastrada');

    return res
      .status(StatusCodes.OK)
      .render(resolveView('linhasDePesquisaListar'), {
        linhaDePesquisa,
        pageTitle,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session?.tipoUsuario
      });
  } catch (error: any) { // Definindo o tipo da variável error como Error
    return res.status(StatusCodes.BAD_REQUEST).render(resolveView('linhasDePesquisaListar'), {
      pageTitle,
      error: error.message || 'Não foi possível listar as linhas de pesquisa!',
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      tipoUsuario: req.session?.tipoUsuario,
    });
  }
};

const buscar = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await linhasDePesquisaService.findById(parseInt(id));

    if (!result)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Linha de Pesquisa Não Encontrada!' });

    const { nome, sigla } = result;

    return res.status(StatusCodes.OK).render(resolveView('linhasDePesquisaBusca'), {
      nome,
      sigla,
      pageTitle,
      tipoUsuario: req.session?.tipoUsuario,
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Erro ao buscar linha de pesquisa!' });
  }
};

const criar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.status(StatusCodes.OK).render(resolveView('linhasDePesquisaCriar'), {
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

      if (await linhasDePesquisaService.findByName(novaLinhaPesquisa.nome))
        throw new Error('Linha de Pesquisa já cadastrada!');

      if (await linhasDePesquisaService.findBySigla(novaLinhaPesquisa.sigla))
        throw new Error('Sigla já cadastrada!');

      await linhasDePesquisaService.criar(novaLinhaPesquisa);
    } catch (error: any) {
      // Definindo o tipo da variável error como Error
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).render(resolveView('linhasDePesquisaCriar'), {
        pageTitle,
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
        error: error.message || 'Não foi possível criar a linha de pesquisa!',
      });
    }

    return res.status(StatusCodes.OK).redirect('/linhasDePesquisa/listar');
  }
};

const remover = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      await linhasDePesquisaService.delete(parseInt(req.params.id));
      return res.redirect('/linhasDePesquisa/listar');
    } catch (error: any) {
      return res.render(resolveView('linhasDePesquisaListar.hbs'), {
        pageTitle,
        error: error.message || 'Não foi possível remover a linha de pesquisa!',
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
      });
    }
  }
};

const editar = async (req: Request, res: Response) => {
  const linhaPesquisa = await linhasDePesquisaService.findById(
    parseInt(req.params.id),
  );
  if (req.method === 'GET') {
    return res.status(200).render(resolveView('linhasDePesquisaEditar'), {
      linhaPesquisa,
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session?.tipoUsuario,
    });
  } else {
    try {
      const editarLinhaPesquisa: UpdateLinhaDePesquisaDto = {
        nome: req.body.nome,
        sigla: req.body.sigla,
      };

      const existingByName = await linhasDePesquisaService.findByName(
        editarLinhaPesquisa.nome,
      );
      const existingBySigla = await linhasDePesquisaService.findBySigla(
        editarLinhaPesquisa.sigla,
      );
      if (existingByName && existingByName.id !== parseInt(req.params.id))
        throw new Error('Linha de Pesquisa já cadastrada!');
      if (existingBySigla && existingBySigla.id !== parseInt(req.params.id))
        throw new Error('Sigla já cadastrada!');

      await linhasDePesquisaService.update(
        parseInt(req.params.id),
        editarLinhaPesquisa,
      );
      return res.redirect('/linhasDePesquisa/listar');
    } catch (error: any) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).render(resolveView('linhasDePesquisaEditar'), {
        pageTitle,
        linhaPesquisa,
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
        error: error.message || 'Não foi possível editar a linha de pesquisa!',
      });
    }
  }
};

export default { listar, buscar, criar, remover, editar };
