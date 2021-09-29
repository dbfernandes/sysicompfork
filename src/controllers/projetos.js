const adicionar = (req, res) => {
   if (req.method === "GET") {
      return res.render('projetos/projetos-adicionar', { 
         nome: req.session.nome
     })
   } else {
      console.log("cadastrar no banco")
   }
}

const listar = (req, res) => {
   return res.render('projetos/projetos-listar', { 
      nome: req.session.nome
  })   
}

export default { adicionar, listar }


