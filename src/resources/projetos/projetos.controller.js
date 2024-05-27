// Rota desativada - funcionalidade removida

const adicionar = (req, res) => {
  if (req.method === 'GET') {
    return res.render('projetos/projetos-adicionar', {
      nome: req.session.nome,
      tipoUsuario: req.session.tipoUsuario
    })
  } else {
    console.log('cadastrar no banco')
  }
}

const listar = (req, res) => {
  return res.render('projetos/projetos-listar', {
    nome: req.session.nome,
    tipoUsuario: req.session.tipoUsuario
  })
}

export default { adicionar, listar }
