import express from 'express';
import selecaoppgiRoutes from './edital.controller';

const router = express.Router();

router.all('/addEdital', selecaoppgiRoutes.addEditalSelecao);
router.all('/listEdital', selecaoppgiRoutes.listEditalSelecao);
router.all('/deleteEdital/:id', selecaoppgiRoutes.deleteEdital);
router.all('/arquivarEdital/:id_edital', selecaoppgiRoutes.arquivarEdital);
router.all('/listEdital/:id', selecaoppgiRoutes.viewEdital);
router.all('/updateEdital/:id_update', selecaoppgiRoutes.updateEdital);
router.all('/listCandidatesEdital/:id', selecaoppgiRoutes.listcandidatosEdital);
router.all('/listEditalCandidates/:id', selecaoppgiRoutes.editalcandidatos);
router.all('/geraPlanilha/:id', selecaoppgiRoutes.geraPlanilha);
router.all('/candidateDetails/:id', selecaoppgiRoutes.candidatoDetails);
router.all(
  '/downloadCandidateDocument/:id',
  selecaoppgiRoutes.getcandidatoDocument,
);
router.all(
  '/getCandidateDocs/:id',
  selecaoppgiRoutes.getAllDocumentsFromOnecandidato,
);
router.all(
  '/getEditalCandidatesDocs/:id',
  selecaoppgiRoutes.getAllcandidatosDocuments,
);

export default router;
