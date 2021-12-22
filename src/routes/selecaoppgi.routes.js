import express from "express"
import selecaoppgiRoutes from "../controllers/Selecao/SelecaoController"

const router = express.Router()

router.get('/adicionar', selecaoppgiRoutes.adicionarView);
router.get('/listar',selecaoppgiRoutes.listarView)

router.post('/adicionar',selecaoppgiRoutes.adicionar);
router.get('/listarselecao',selecaoppgiRoutes.listar)




export default router