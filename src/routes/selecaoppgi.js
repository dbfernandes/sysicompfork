import express from "express"
import selecaoppgiRoutes from "../controllers/selecaoPpgi"

const router = express.Router()

router.get('/adicionar', selecaoppgiRoutes.adicionar);
router.post('/adicionar',selecaoppgiRoutes.adicionar);

router.get('/listar',selecaoppgiRoutes.listar)
router.post('/listar',selecaoppgiRoutes.listar)




export default router