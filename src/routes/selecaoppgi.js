import express from "express"
import selecaoppgiRoutes from "../controllers/selecaoPpgi"

const router = express.Router()

router.get('/adicionar', selecaoppgiRoutes.adicionar);




export default router