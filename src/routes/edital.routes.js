import express from "express"
import selecaoppgiRoutes from "../controllers/selecaoppgiBackendController"

const router = express.Router()

router.all('/addEdital', selecaoppgiRoutes.addEditalSelecao);
router.all('/listEdital',selecaoppgiRoutes.listEditalSelecao);


export default router