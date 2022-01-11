import EditalService from '../services/editalService';

const locals = { 
	layout: 'selecaoppgi' 
}

const addEditalSelecao = async (req, res) => {
   switch (req.method) {

      case 'GET':
         console.log(req.session.nome);
         return res.render('edital/addNewSelecao', {
            nome: req.session.nome,
            ...locals
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
               req: req.body
            })
         });
         return res.status(200).send(selecao);

      case 'PUT':
         return res.status(200).send({
            message: 'TO-DO'
         });

      default:
         return res.status(404).send();

   }
}

const listEditalSelecao = async (req, res) => {
   switch (req.method) {
      case 'GET':
         return res.render('edital/listSelecao', {
            nome: req.session.nome,
            ...locals,
            editais: await EditalService.listEdital()
         })
         
      case 'POST':
         const editais =  await EditalService.listEdital().catch((err) => {
            return res.status(400).json({
               error: err.message
            })
         });
         return res.status(200).json(editais);
   }
}

const viewEdital = async (req, res) => {
   switch (req.method) {
      case 'GET':
         const { id } = req.params
         const edital = await EditalService.getEdital(id).catch((err) => {
            return res.status(400).json({
               error: err.message
            })
         });
         return res.render('edital/editSelecao/'+id, {
            nome: req.session.nome,
            ...locals,
            edital: edital
         })
   }
}

const editSelecao = async (req, res) => {
   switch (req.method) {
      case 'PUT':
         const { id } = req.params
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

         const selecao = await EditalService.update(id, {
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
               req: req.body
            })
         });
         return res.status(200).send(selecao);

      default:
         return res.status(404).send();
   }
}
export default {
   listEditalSelecao,
   addEditalSelecao
}