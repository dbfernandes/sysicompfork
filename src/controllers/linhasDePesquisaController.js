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
    .render('linhasDePesquisa/linhasDePesquisa-listar', { linhaDePesquisa, pageTitle, ...locals, tipoUsuario: _req.session.tipoUsuario });
};

const buscar = async (req, res) => {
  const { id } = req.params;

  const result = await linhasDePesquisaService.findById(id);

  if (!result) return res.status(400).json({ message: 'Linha de Pesquisa Não Encontrada!'});

  const { nome, sigla, icone, cor } = result;

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-busca', { nome, sigla, icone, cor, pageTitle, ...locals,  tipoUsuario: req.session.tipoUsuario});
};

export default { listar, buscar };
