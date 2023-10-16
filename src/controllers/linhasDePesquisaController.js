import linhasDePesquisaService from '../services/linhasDePesquisaService';

const locals = {
  layout: 'dataTable',
};

const pageTitle = 'Linhas De Pesquisa';

const listar = async (req, res) => {
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

  const { nome, sigla } = result;

  return res
    .status(200)
    .render('linhasDePesquisa/linhasDePesquisa-busca', { nome, sigla, icone, cor, pageTitle, ...locals,  tipoUsuario: req.session.tipoUsuario});
};

const criar = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).
    render('linhasDePesquisa/linhasDePesquisa-criar',{ 
      pageTitle, csrfToken: req.csrfToken() 
    });
  } else {
    try {
      const nome = req.body.nome;
      const sigla = req.body.sigla;
      
      if (await linhasDePesquisaService.findByName(nome)) throw new Error('Linha de Pesquisa já cadastrada!');

      if (await linhasDePesquisaService.findBySigla(sigla)) throw new Error('Sigla já cadastrada!');

      await linhasDePesquisaService.create({ nome, sigla });  

    } catch (error ){
      console.log(error)
      return res.render('linhasDePesquisa/linhasDePesquisa-criar', {
        pageTitle, csrfToken: req.csrfToken(), 
        error: error.message || 'Não foi possível criar a linha de pesquisa!'
      });
    }
    
    return res.redirect('/linhasDePesquisa/listar');
  }
};

const remover = async (req, res) => {
  if (req.method == 'POST') {
    try {
      linhasDePesquisaService.delete(req.params.id);
    } catch (error) {
      console.log(error)
      return res.redirect('/linhasDePesquisa/listar')
    }
  }
  else
  {
    console.log('Não foi possível remover a linha de pesquisa!')
  }
  return res.redirect('/linhasDePesquisa/listar');
};

const editar = async (req, res) => {
  const linhaPesquisa = await linhasDePesquisaService.findById(req.params.id);
  if (req.method === 'GET') {
    return res.status(200).render('linhasDePesquisa/linhasDePesquisa-editar', { 
      linhaPesquisa, pageTitle, csrfToken: req.csrfToken() 
    });

  } else {
    try {
      const nome = req.body.nome;
      const sigla = req.body.sigla;

      if (await linhasDePesquisaService.findByName(nome)) throw new Error('Linha de Pesquisa já cadastrada!');
      
      if (await linhasDePesquisaService.findBySigla(sigla)) throw new Error('Sigla já cadastrada!');
      
      await linhasDePesquisaService.update(req.params.id, { nome, sigla });
      
    } catch (error) {
      console.log(error)
      return res.render('linhasDePesquisa/linhasDePesquisa-editar', {
        pageTitle, linhaPesquisa, csrfToken: req.csrfToken(), 
        error: error.message || 'Não foi possível editar a linha de pesquisa!'
      });
    }
  }
  return res.redirect('/linhasDePesquisa/listar');
};

export default { listar, buscar, criar, remover, editar};
