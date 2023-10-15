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


export default router