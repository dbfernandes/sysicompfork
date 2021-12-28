import EditalService from '../services/editalService';

const addEditalSelecao = async (req, res) => {
   switch (req.method) {

      case 'GET':
         console.log(req.session.nome);
         return res.render('edital/addNewSelecao', {
            nome: req.session.nome
         })

      case 'POST':
         const {
            number,
            documento,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado
         } = await req.body

         // TO-DO: Validar dados, verificar se nao tem nenhum dado faltando

         const selecao = await EditalService.create({
            number,
            documento,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado
         }).catch((err) => {
            return res.status(400).json({
               error: err.message,
               body: {
                  number,
                  documento,
                  data_inicio,
                  data_fim,
                  carta_recomendacao,
                  carta_orientador,
                  vaga_regular_mestrado,
                  vaga_suplementar_mestrado,
                  vaga_regular_doutorado,
                  vaga_suplementar_doutorado
               }
            })
         });

         if (!selecao) {
            return res.status(400).json({
               error: responseError.message
            });
         }
         return res.status(200).send(selecao);

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