const selecoes = [];

const adicionar = async (req, res) => {
   if (req.method === "GET") {

      return res.render('layouts/selecaoppgi/selecaoppgi-adicionar', {
         nome: req.session.nome
      })
   } else {
      console.log("cadastrar no banco")
   }
   if (req.method === "POST") {
      const { nome, url, data_inicio, data_fim, carta_recomendacao, carta_orientador, mestrado, vaga_regular_mestrado, vaga_suplementar_Mestrado, Doutorado, vaga_regular_doutorado, vaga_suplementar_doutorado } = await req.body

      const selecao ={}



   }
}

const listar = (req, res) => {
   if (req.method === "GET") {
      return res.render('layouts/selecaoppgi/selecaoppgi-listar', {
         nome: req.session.nome
      })
   } else {
      console.log("cadastrar no banco")
   }
}
export default { adicionar, listar }