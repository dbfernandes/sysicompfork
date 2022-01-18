import linhasDePesquisaService from '../services/linhasDePesquisaService';

const locals = {
  layout: 'linhasDePesquisa',
};

const criar = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      return res
      .status(200)
      .render('linhasDePesquisa/linhasDePesquisa-criar', { ...locals });
    }
    case 'POST': {
      const { nome, sigla, cor, icone } = req.body;

      await linhasDePesquisaService.create({ nome, sigla, cor, icone });

      return res.status(201).redirect('listar');
    }
    default:
      return res.status(500).json({ message: 'Internal Error' });
  }
};

const listar = async (req, res) => {
  switch (req.method) {
  case 'GET': {
    const linhaDePesquisa = await linhasDePesquisaService.list();
    const doesNotExists = !linhaDePesquisa || linhaDePesquisa.length === 0;

    if (doesNotExists) res.status(400).json({ message: 'Nenhuma linha de pesquisa cadastrada' });

    return res
      .status(200)
      .render('linhasDePesquisa/linhasDePesquisa-listar', { linhaDePesquisa, ...locals });
  }
  default:
    return res.status(500).json({ message: 'Internal Erro' });
  }
};

const buscar = async (req, res) => {
  const { id } = req.params;

  const result = await linhasDePesquisaService.findById(id);

  if (!result) return res.status(400).json({ message: 'Linha de Pesquisa Não Encontrada!'});

  const { nome, sigla, icone, cor } = result;

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-busca', { id, nome, sigla, icone, cor, ...locals });
};


const editar = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.params;
      const { nome, sigla, icone, cor } = await linhasDePesquisaService.findById(id);

      return res
        .status(200)
        .render('linhasDePesquisa/linhasDePesquisa-editar', { id, nome, sigla, icone, cor, ...locals });
    }
    case 'POST': {
      const { id } = req.params;
      const result = req.body;
      await linhasDePesquisaService.update(id, result);

      return res.status(200).redirect('../listar');
    }
    default:
      return res.status(500).json({ message: 'Internal Error' });
  }
};

const remover = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.params;
      console.log(`ID to be deleted -> ${id}`);
      await linhasDePesquisaService.remove(id);
      return res.status(200).redirect('../listar');
    }
    default:
      return res.status(500).json({ message: 'Internal Error' });
  }
};

export default { listar, buscar, criar, editar, remover };
