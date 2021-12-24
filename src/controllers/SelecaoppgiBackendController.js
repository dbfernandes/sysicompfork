import EditalService from '../services/edital';

const addEditalSelecao = async (req, res) => {
   switch (req.method) {
      case 'GET':
         return res.render('selecaoppgi/addNewSelecao', {
            nome: req.session.nome
         })
      case 'POST':
         const {
            nome,
            url,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            mestrado,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            Doutorado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado
         } = await req.body

         const selecao =  await EditalService.create({
            nome,
            url,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            mestrado,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            Doutorado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado
         })

         return res.status(201).send(selecao)

         default:
			return res.status(404).send();


         
        
   }
}

const listEditalSelecao = (req, res) => {
   switch (req.method) {
      case 'GET':
         return res.render('selecaoppgi/listSelecao', {
            nome: req.session.nome
         })
         case 'GET':
            return res.status(200).send(selecoes);
   }
}



export default {
   listEditalSelecao,
   addEditalSelecao
}