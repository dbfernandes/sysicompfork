const adicionar = (req, res) => {
    if (req.method === "GET") {
       return res.render('layouts/selecaoppgi/selecaoppgi-adicionar', { 
          nome: req.session.nome
      })
    } else {
       console.log("cadastrar no banco")
    }
 }

 export default { adicionar}