import express from 'express';
import selecaoppgiRoutes from './edital.controller';
import autenticacaoController from '../autenticacao/autenticacao.controller';
const router = express.Router();

router.all('/listEdital', selecaoppgiRoutes.listEditalSelecao);
router.all('/listEdital/:id', selecaoppgiRoutes.viewEdital);
router.all('/addEdital', autenticacaoController.autorizarCoord, selecaoppgiRoutes.addEditalSelecao);
router.all('/deleteEdital/:id', autenticacaoController.autorizarCoord, selecaoppgiRoutes.deleteEdital);
router.all('/arquivarEdital/:id_edital', autenticacaoController.autorizarCoord, selecaoppgiRoutes.arquivarEdital);
router.all('/updateEdital/:id_update', autenticacaoController.autorizarCoord, selecaoppgiRoutes.updateEdital);
router.all('/listCandidatesEdital/:id', autenticacaoController.autorizarCoord, selecaoppgiRoutes.listCandidatesEdital);
router.all('/listEditalCandidates/:id', autenticacaoController.autorizarCoord, selecaoppgiRoutes.editalCandidates);
router.all('/geraPlanilha/:id', autenticacaoController.autorizarCoord, selecaoppgiRoutes.geraPlanilha);
router.all('/candidateDetails/:id', autenticacaoController.autorizarCoord, selecaoppgiRoutes.candidateDetails);
router.all(
  '/downloadCandidateDocument/:id',
  autenticacaoController.autorizarCoord, 
  selecaoppgiRoutes.getCandidateDocument,
);
router.all(
  '/getCandidateDocs/:id',
  autenticacaoController.autorizarCoord, 
  selecaoppgiRoutes.getAllDocumentsFromOneCandidate,
);
router.all(
  '/getEditalCandidatesDocs/:id',
  autenticacaoController.autorizarCoord, 
  selecaoppgiRoutes.getAllCandidatesDocuments,
);

export default router;
