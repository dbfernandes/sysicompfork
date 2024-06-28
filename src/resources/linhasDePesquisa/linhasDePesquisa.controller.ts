import { Request, Response } from 'express';
import linhasDePesquisaService from './linhasDePesquisa.service';
const pageTitle = 'Linhas De Pesquisa';

const listar = async (req: Request, res: Response) => {
  try {
    const linhaDePesquisa = await linhasDePesquisaService.list();
    const doesNotExists = !linhaDePesquisa || linhaDePesquisa.length === 0;

    if (doesNotExists) throw new Error('Nenhuma linha de pesquisa cadastrada');

    return res.status(200).render('linhasDePesquisa/linhasDePesquisa-listar', {
      linhaDePesquisa,
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session?.tipoUsuario,
    });
  } catch (error: any) {
    // Definindo o tipo da variável error como Error
    return res.status(400).render('linhasDePesquisa/linhasDePesquisa-listar', {
      pageTitle,
      error: error.message || 'Não foi possível listar as linhas de pesquisa!',
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session?.tipoUsuario,
    });
  }
};

const buscar = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await linhasDePesquisaService.findById(parseInt(id));

  if (!result)
    return res
      .status(400)
      .json({ message: 'Linha de Pesquisa Não Encontrada!' });

  const { nome, sigla } = result;

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-busca', {
      nome,
      sigla,
      pageTitle,
      tipoUsuario: req.session?.tipoUsuario,
    });
};

const criar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.status(200).render('linhasDePesquisa/linhasDePesquisa-criar', {
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session?.tipoUsuario,
    });
  } else {
    try {
      const { nome, sigla } = req.body;

      if (await linhasDePesquisaService.findByName(nome)) {
        throw new Error('Linha de Pesquisa já cadastrada!');
      }

      if (await linhasDePesquisaService.findBySigla(sigla)) {
        throw new Error('Sigla já cadastrada!');
      }

      await linhasDePesquisaService.criar(nome, sigla);
    } catch (error: any) {
      console.log(error);
      return res.render('linhasDePesquisa/linhasDePesquisa-criar', {
        pageTitle,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
        error: error.message || 'Não foi possível criar a linha de pesquisa!',
      });
    }

    return res.redirect('/linhasDePesquisa/listar');
  }
};

const remover = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      linhasDePesquisaService.delete(parseInt(req.params.id));
    } catch (error) {
      console.log(error);
      return res.redirect('/linhasDePesquisa/listar');
    }
  } else {
    console.log('Não foi possível remover a linha de pesquisa!');
  }
  return res.redirect('/linhasDePesquisa/listar');
};

const editar = async (req: Request, res: Response) => {
  const linhaPesquisa = await linhasDePesquisaService.findById(
    parseInt(req.params.id),
  );
  if (req.method === 'GET') {
    return res.status(200).render('linhasDePesquisa/linhasDePesquisa-editar', {
      linhaPesquisa,
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session?.tipoUsuario,
    });
  } else {
    try {
      const nome = req.body.nome;
      const sigla = req.body.sigla;

      if (await linhasDePesquisaService.findByName(nome))
        throw new Error('Linha de Pesquisa já cadastrada!');

      if (await linhasDePesquisaService.findBySigla(sigla))
        throw new Error('Sigla já cadastrada!');

      await linhasDePesquisaService.update(parseInt(req.params.id), {
        nome,
        sigla,
      });
    } catch (error: any) {
      console.log(error);
      return res.render('linhasDePesquisa/linhasDePesquisa-editar', {
        pageTitle,
        linhaPesquisa,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session?.tipoUsuario,
        error: error.message || 'Não foi possível editar a linha de pesquisa!',
      });
    }
  }
  return res.redirect('/linhasDePesquisa/listar');
};

export default { listar, buscar, criar, remover, editar };
