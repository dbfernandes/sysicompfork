import linhasDePesquisaService from '../services/linhasDePesquisaService';

const locals = {
  layout: 'dataTable',
};

const pageTitle = 'Linhas De Pesquisa';

const listar = async (_req, res) => {
  const linhaDePesquisa = await linhasDePesquisaService.list();
  const doesNotExists = !linhaDePesquisa || linhaDePesquisa.length === 0;

  if (doesNotExists) res.status(400).json({ message: 'Nenhuma linha de pesquisa cadastrada' });

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-listar', { linhaDePesquisa, pageTitle});
};

const buscar = async (req, res) => {
  const { id } = req.params;

  const result = await linhasDePesquisaService.findById(id);

  if (!result) return res.status(400).json({ message: 'Linha de Pesquisa Não Encontrada!'});

  const { nome, sigla, icone, cor } = result;

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-busca', { nome, sigla, icone, cor, pageTitle});
};

const criar = async (req, res) => {
  
  const { nome, sigla, icone, cor } = req.body;

  const result = await linhasDePesquisaService.create({ nome, icone, sigla, cor });

  if (!result) return res.status(400).json({ message: 'Não foi possível criar a linha de pesquisa!'});

  return res.status(200).render('linhasDePesquisa/linhasDePesquisa-criar', { nome, sigla, icone, cor, pageTitle });
};

export default { listar, buscar, criar};
