const adicionar = (req, res) => {
    if (req.method === "GET") {
       return res.render('/', { 
          nome: req.session.nome
      })
    } else {
       console.log("cadastrar no banco")
    }
 }