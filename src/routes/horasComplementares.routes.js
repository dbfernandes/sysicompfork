import express from "express";
import horasComplementares from "../controllers/horasComplementaresController";
const router = express.Router();

router.get('/listar', horasComplementares.listarHoras);
router.get('/adicionar', horasComplementares.adicionarAtividade)


export default router;
