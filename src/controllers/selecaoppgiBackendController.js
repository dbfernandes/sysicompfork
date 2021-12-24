import EditalService from '../services/edital';

const addEditalSelecao = async (req, res) => {
   switch (req.method) {
      

      case 'GET':
         return res.render('edital/addNewSelecao', {
            nome: req.session.nome
         })
         
      case 'POST':
         const {
            number,
            url,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado
         } = await req.body

         const selecao =  await EditalService
            .create({
               number: number,
               url:url,
               data_inicio:data_inicio,
               data_fim:data_fim,
               carta_recomendacao:carta_recomendacao,
               carta_orientador:carta_orientador,
               vaga_regular_mestrado:vaga_regular_mestrado,
               vaga_suplementar_mestrado:vaga_suplementar_mestrado,
               vaga_regular_doutorado:vaga_regular_doutorado,
               vaga_suplementar_doutorado:vaga_suplementar_doutorado
            })
            .catch((err)=>{
               responseError = err;
            });

         if(!selecao){		
            return res.status(400).json({error: responseError.message});
         }
         return res.status(200).redirect('/selecaoppgi');

      case 'PUT':
         return res.status(200).send({
            message: 'TO-DO'
         });
         
      default:
         return res.status(404).send();
      
   }
}

const listEditalSelecao = (req, res) => {
   switch (req.method) {
      case 'GET':
         return res.render('edital/listSelecao', {
            nome: req.session.nome
         })
      case 'POST':
         return res.status(200).send(selecao);
   }
}



export default {
   listEditalSelecao,
   addEditalSelecao
}