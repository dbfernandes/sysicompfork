import express from "express"
import selecaoppgiRoutes from "../controllers/editalController"

const router = express.Router()

router.all('/addEdital', selecaoppgiRoutes.addEditalSelecao);
router.all('/listEdital',selecaoppgiRoutes.listEditalSelecao);
router.all('/deleteEdital/:id',selecaoppgiRoutes.deleteEdital);
router.all('/listEdital/:id',selecaoppgiRoutes.viewEdital);
router.all('/updateEdital/:id',selecaoppgiRoutes.updateEdital);	


export default router