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

  const { nome, sigla } = result;

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-busca', { nome, sigla, pageTitle});
};

const criar = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).render('linhasDePesquisa/linhasDePesquisa-criar',{ pageTitle, csrfToken: req.csrfToken() });
  } else {
    try {
      const nome = req.body.nome;
      const sigla = req.body.sigla;
      console.log(nome)
      console.log(sigla)
      await linhasDePesquisaService.create({ nome, sigla });  

    } catch (error ){
      console.log(error)
      return res.status(400).json({ message: 'Não foi possível criar a linha de pesquisa!'});
    }
    
    return res.redirect(200,'/linhasDePesquisa/listar');
  }
};

export default { listar, buscar, criar};
