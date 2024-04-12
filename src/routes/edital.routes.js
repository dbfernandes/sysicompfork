import express from "express"
import selecaoppgiRoutes from "../controllers/editalController"

const router = express.Router()

router.all('/addEdital', selecaoppgiRoutes.addEditalSelecao);
router.all('/listEdital',selecaoppgiRoutes.listEditalSelecao);
router.all('/deleteEdital/:id',selecaoppgiRoutes.deleteEdital);
router.all('/arquivarEdital/:id_edital',selecaoppgiRoutes.arquivarEdital);
router.all('/listEdital/:id',selecaoppgiRoutes.viewEdital);
router.all('/updateEdital/:id_update',selecaoppgiRoutes.updateEdital);	
router.all('/listCandidatesEdital/:id',selecaoppgiRoutes.listCandidatesEdital);
router.all('/listEditalCandidates/:id',selecaoppgiRoutes.editalCandidates);
router.all('/geraPlanilha/:id',selecaoppgiRoutes.geraPlanilha);
router.all('/candidateDetails/:id',selecaoppgiRoutes.candidateDetails);
router.all('/gerarCandidatoPDF',selecaoppgiRoutes.gerarCandidatoPDF);
router.all('/getCandidateDocs/:id',selecaoppgiRoutes.getAllDocumentsFromOneCandidate);
router.all('/getEditalCandidatesDocs/:id',selecaoppgiRoutes.getAllCandidatesDocuments);

export default router