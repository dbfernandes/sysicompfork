import EditalService from "../services/editalService";
import editalGerarPlanilha from "../utils/editalGerarPlanilha";
import linhasDePesquisaService from "../services/linhasDePesquisaService";
import logger from "../utils/logger";
const zip = require('express-zip');
const StreamZip = require('node-stream-zip');
const fs = require('fs');
const path = require('path');
const os = require('os');
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
            logger.info(`Edital ${num_edital} criado com sucesso por ${req.session.nome}`);
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
         const { id } = req.params;

         try {
            await EditalService.delete(id);
            logger.info(`Edital ${id} deletado por ${req.session.nome}`);     
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
         logger.info(`Edital ${id_edital} arquivado por ${req.session.nome}`);
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
         logger.info(`Edital ${id_update} atualizado por ${req.session.nome}`);
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

const editalCandidates = async (req, res) => {
   const editalID = req.params.id;
   const candidates = await EditalService.listCandidates(editalID).catch(
      (err) => {
         return res.status(400).json({
            error: err.message,
         });
      }
   );

   const quantidaDeInscricaoAndamento = candidates.filter(candidate => candidate.editalPosition < 4).length; 
   const quantidaIncricaoFinalizada = candidates.filter(candidate => candidate.editalPosition == 4).length;
   
   return res.render("edital/listCandidates", {
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      ...locals,
      candidates: candidates,
      editalID: editalID,
      tipoUsuario: req.session.tipoUsuario,
      quantidaDeInscricaoAndamento,
      quantidaIncricaoFinalizada,

   });
}

const geraPlanilha = async (req, res) => {
   const planilha = await editalGerarPlanilha.gerarPlanilha(req.params.id);
   logger.info(`Planilha do edital ${req.params.id} gerada por ${req.session.nome}`);
   return res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=planilha.xlsx',
      'Content-Length': planilha.length
   }).status(200).send(planilha);
}

const gerarCandidatoPDF = async (req, res) => {
   const candidate = await EditalService.getCandidate(req.params.id);
   const base64Documento = candidate[req.query.documento];
   const docPDF = Buffer.from(base64Documento.toString('utf-8'),'base64')
   
   logger.info(`Documento ${req.query.documento} do candidato ${req.params.id} gerado por ${req.session.nome}`);
   return res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=index.pdf`,
      'Content-Length': docPDF.length
   }).status(200).send(docPDF);
}

const getAllCandidatesDocuments = async (req, res) => {
   try {
      // Pegue todos os candidatos do edital
      const candidates = await EditalService.listCandidates(req.params.id);
      
      // Crie um diretório temporário para armazenar os documentos
      const tempDirPath = path.join(os.tmpdir(), 'documents-');
      if (fs.existsSync(tempDirPath)) fs.rmdirSync(tempDirPath, { recursive: true });
      fs.mkdirSync(tempDirPath);

      // Para cada candidato, crie um arquivo PDF com os documentos
      const candidatesDocuments = [];
      for (const candidate of candidates) {
         
         if ( candidate.Curriculum ) {
            const docCurriculumPath = path.join(tempDirPath, `${candidate.Nome}-Curriculum.pdf`);
            fs.writeFileSync(docCurriculumPath, candidate.Curriculum.toString('utf-8'), 'base64');
            candidatesDocuments.push({ path: docCurriculumPath, name: `${candidate.Nome}/${candidate.Nome}-Curriculum.pdf` });
         }

         if ( candidate.CartaDoOrientador ) {
            const docCartaOrientadorPath = path.join(tempDirPath, `${candidate.Nome}-CartaDoOrientador.pdf`);
            fs.writeFileSync(docCartaOrientadorPath, candidate.CartaDoOrientador.toString('utf-8'), 'base64');
            candidatesDocuments.push({ path: docCartaOrientadorPath, name: `${candidate.Nome}/${candidate.Nome}-CartaDoOrientador.pdf` });
         }

         if ( candidate.PropostaDeTrabalho ) {
            const docPropostaPath = path.join(tempDirPath, `${candidate.Nome}-PropostaDeTrabalho.pdf`);
            fs.writeFileSync(docPropostaPath, candidate.PropostaDeTrabalho.toString('utf-8'), 'base64');
            candidatesDocuments.push({ path: docPropostaPath, name: `${candidate.Nome}/${candidate.Nome}-PropostaDeTrabalho.pdf` });
         }
      }

      logger.info(`Documentos de todos os candidatos do edital ${req.params.id} gerados por ${req.session.nome}`);

      // Compacte todos os arquivos em um arquivo ZIP
      const zipFilePath = path.join(tempDirPath, 'documentos.zip');
      await res.zip(candidatesDocuments, zipFilePath);

      // Remova o diretório temporário
      fs.rmdirSync(tempDirPath, { recursive: true });

      // Envie o arquivo ZIP para o cliente
      return res.download(zipFilePath, 'documentos.zip');

      // return res.zip(candidatesDocuments, 'documentos.zip');

   } catch (error) {
      res.status(400).json({
         error: error.message,
      });
   }
}

const getAllDocumentsFromOneCandidate = async (req, res) => {
   const candidate = await EditalService.getCandidate(req.params.id);
   try {
      const tempDirPath = path.join(os.tmpdir(), 'documents-');
      if (fs.existsSync(tempDirPath)) fs.rmdirSync(tempDirPath, { recursive: true });
      fs.mkdirSync(tempDirPath);

      const candidateDocuments = [];

      if (candidate.Curriculum) {
         const docCurriculumPath = path.join(tempDirPath, 'Curriculum.pdf');
         fs.writeFileSync(docCurriculumPath, candidate.Curriculum.toString('utf-8'), 'base64');
         candidateDocuments.push({ path: docCurriculumPath, name: 'Curriculum.pdf' });
      }

      if (candidate.CartaDoOrientador) {
         const docCartaOrientadorPath = path.join(tempDirPath, 'CartaDoOrientador.pdf');
         fs.writeFileSync(docCartaOrientadorPath, candidate.CartaDoOrientador.toString('utf-8'), 'base64');
         candidateDocuments.push({ path: docCartaOrientadorPath, name: 'CartaDoOrientador.pdf' });
      }

      if (candidate.PropostaDeTrabalho) {
         const docPropostaPath = path.join(tempDirPath, 'PropostaDeTrabalho.pdf');
         fs.writeFileSync(docPropostaPath, candidate.PropostaDeTrabalho.toString('utf-8'), 'base64');
         candidateDocuments.push({ path: docPropostaPath, name: 'PropostaDeTrabalho.pdf' });
      }

      const zipFilePath = path.join(tempDirPath, 'documentos.zip');
      await res.zip(candidateDocuments, zipFilePath);

      fs.rmdirSync(tempDirPath, { recursive: true });

      return res.download(zipFilePath, 'documentos.zip');

      logger.info(`Documentos do candidato ${req.params.id} gerados por ${req.session.nome}`);
      
      return res.zip(candidateDocuments, 'documentos.zip');
   } catch (error) {
      res.status(400).json({
         error: error.message,
      });
   }
}

const candidateDetails = async (req, res) => {
   try {
      const candidate = await EditalService.getCandidate(req.params.id);
      
      return res.render("edital/candidateDetails", {
         candidate: candidate.dataValues,
         csrfToken: req.csrfToken(),
         nome: req.session.nome,
         ...locals,
         tipoUsuario: req.session.tipoUsuario
      });
   } catch (error) {
      return res.status(400).json({
         error: error.message,
      });
   }
   
};

export default {
   listEditalSelecao,
   addEditalSelecao,
   deleteEdital,
   arquivarEdital,
   viewEdital,
   listCandidatesEdital,
   updateEdital,
   geraPlanilha,
   editalCandidates,
   candidateDetails,
   gerarCandidatoPDF,
   getAllDocumentsFromOneCandidate,
   getAllCandidatesDocuments
};