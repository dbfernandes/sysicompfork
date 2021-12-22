import express from "express"
import selecaoppgiRoutes from "../controllers/Selecao/selecaoPpgi"

const router = express.Router()

router.get('/adicionar', selecaoppgiRoutes.adicionarView);
router.get('/listar',selecaoppgiRoutes.listarView)

router.post('/adicionar',selecaoppgiRoutes.adicionar);
router.post('/listar',selecaoppgiRoutes.listar)




export default router