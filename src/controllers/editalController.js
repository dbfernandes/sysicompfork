import EditalService from "../services/editalService";
import editalGerarPlanilha from "../services/editalGerarPlanilha";

const locals = {
   layout: "selecaoppgi",
};

const addEditalSelecao = async (req, res) => {
   switch (req.method) {
      case "GET":
         console.log(req.session.nome);
         return res.render("edital/addNewSelecao", {
            csrfToken: req.csrfToken(),
            tipoUsuario: req.session.tipoUsuario,
            nome: req.session.nome,
            ...locals,             
         });


      case "POST":
         const {
            num_edital,
            documento,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado,
         } = await req.body;

         try {
            await EditalService.criarEdital({
                num_edital,
                documento,
                data_inicio,
                data_fim,
                carta_recomendacao,
                carta_orientador,
                vaga_regular_mestrado,
                vaga_suplementar_mestrado,
                vaga_regular_doutorado,
                vaga_suplementar_doutorado
            });     
        } catch (error) {
            return res.status(400).json({
                csrfToken: req.csrfToken(),
                error: error.message,
                req: req.body
            });
        }
        

      case "PUT":
         return res.status(200).send({
            message: "TO-DO",
         });

      default:
         return res.status(404).send();
   }
};

const listEditalSelecao = async (req, res) => {
   switch (req.method) {
      case "GET":
         return res.render("edital/listSelecao", {
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            editais: await EditalService.listEdital(),
            tipoUsuario: req.session.tipoUsuario
         });

      case "POST":
         const editais = await EditalService.listEdital().catch((err) => {
            return res.status(400).json({
               error: err.message,
            });
         });
         return res.status(200).json(editais);

      default:
         return res.status(404).send();
   }
};

const deleteEdital = async (req, res) => {
   switch (req.method) {
      case "DELETE":

      console.log("aqui no controller delete")

         const { id } = req.params;

         try {
            await EditalService.delete(id);     
         }catch (error) {
            return res.status(400).json({
               csrfToken: req.csrfToken(),
               error: error.message,
            });
        }

      default:
         return res.status(404).send();
   }
};

const arquivarEdital = async (req, res) => {
   const { id_edital } = req.params;

   console.log('no controler :' + id_edital);
   switch (req.method) {
      case "PUT":
         const { status } = await req.body;

         const edital_update = await EditalService.arquivar(id_edital, {
            status,
         }).catch((err) => {
            return res.status(400).json({
               error: err.message,
            });
         });

         return res.status(200).send(edital_update);

      default:
         return res.status(404).send();
   }
};

const viewEdital = async (req, res) => {
   switch (req.method) {
      case "GET":
         const {
            id
         } = req.params;
         const edital = await EditalService.getEdital(id).catch((err) => {
            return res.status(400).json({
               error: err.message,
            });
         });
         return res.render("edital/viewSelecao", {
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            ...locals,
            edital: edital.dataValues,
            tipoUsuario: req.session.tipoUsuario
         });
   }
};

const updateEdital = async (req, res) => {
   const { id_update } = req.params;
   switch (req.method) {
      case "GET":
         const edital = await EditalService.getEdital(id_update).catch((err) => {
            return res.status(400).json({
               error: err.message,
            });
         });
         return res.render("edital/editSelecao", {
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            ...locals,
            edital: edital.dataValues,
            tipoUsuario: req.session.tipoUsuario
         });

      case "PUT":
         const {
            num_edital,
            documento,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado,
         } = await req.body;

         const edital_update = await EditalService.update(id_update, {
            num_edital,
            documento,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado,
         }).catch((err) => {
            return res.status(400).json({
               error: err.message,
            });
         });
         return res.status(200).send(edital_update);

      default:
         return res.status(404).send();
   }
};

const listCandidatesEdital = async (req, res) => {
   switch (req.method) {
      case "GET":
         const {
            id
         } = req.params;
         const edital = await EditalService.getEdital(id).catch((err) => {
            return res.status(400).json({
               error: err.message,
            });
         });
         return res.render("edital/listCandidates", {
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            ...locals,
            edital: edital.dataValues,
            tipoUsuario: req.session.tipoUsuario
         });
         
      case "POST":
         const {
            id_edital
         } = req.params;
         const candidates = await EditalService.listCandidates(id_edital).catch(
            (err) => {
               return res.status(400).json({
                  error: err.message,
               });
            }
         );
         return res.status(200).json(candidates);
   }
}

const geraPlanilha = async (req, res) => {
   const planilha = await editalGerarPlanilha.gerarPlanilha(req.params.id);
   return res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=planilha.xlsx',
      'Content-Length': planilha.length
   }).status(200).send(planilha);
}

export default {
   listEditalSelecao,
   addEditalSelecao,
   deleteEdital,
   arquivarEdital,
   viewEdital,
   listCandidatesEdital,
   updateEdital,
   geraPlanilha,
};