import express from 'express';
import editalController from './edital.controller';

const router = express.Router();

router.all('/addEdital', editalController.addEditalSelecao);
router.all('/listEdital', editalController.listEditalSelecao);
router.all('/listEdital/:id', editalController.viewEdital);
router.all('/arquivarEdital/:id_edital', editalController.arquivarEdital);
router.all('/updateEdital/:id_update', editalController.updateEdital);
router.all('/listEditalCandidates/:id', editalController.listCandidatos);
router.all('/geraPlanilha/:id', editalController.geraPlanilha);
router.all('/candidateDetails/:id', editalController.candidatoDetails);
router.all(
  '/downloadCandidateDocument/:id',
  editalController.getDocumentToCandidate,
);
router.all('/getCandidateDocs/:id', editalController.getDocumentsToCandidate);
router.all(
  '/getEditalCandidatesDocs/:id',
  editalController.getDocumentsToAllCandidates,
);

export default router;
