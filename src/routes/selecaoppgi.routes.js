import express from "express"
import selecaoppgiRoutes from "../controllers/SelecaoppgiBackendController"

const router = express.Router()

router.get('/adicionar', selecaoppgiRoutes.addEditalSelecao);
router.get('/listar',selecaoppgiRoutes.listEditalSelecao)


export default router