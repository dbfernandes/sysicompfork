import express from 'express';
import editalController from './edital.controller';

const router = express.Router();

router.all('/addEdital', editalController.adicionarEditalSelecao);
router.all('/listEdital', editalController.listarEditalSelecao);
router.all('/listEdital/:id', editalController.exibirDetalhesEdital);
router.all('/arquivarEdital/:id_edital', editalController.arquivarEdital);
router.all('/updateEdital/:id_update', editalController.updateEdital);
router.all('/listEditalCandidates/:id', editalController.listarCandidatos);
router.all('/geraPlanilha/:id', editalController.geraPlanilha);
router.all('/candidateDetails/:id', editalController.exibirDetalhesCandidato);
router.all(
  '/downloadCandidateDocument/:id',
  editalController.pegarDocumentoCandidato,
);
router.all(
  '/getCandidateDocs/:id',
  editalController.pegarDocumentsDeUmCandidate,
);
router.all(
  '/getEditalCandidatesDocs/:id',
  editalController.pegarDocumentosDeTodosCandidatos,
);

export default router;
