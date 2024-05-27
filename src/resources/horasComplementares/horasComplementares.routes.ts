import express from 'express'
import horasComplementares from './horasComplementares.controller'
const router = express.Router()

router.get('/listar', horasComplementares.listarHoras)
router.get('/adicionar', horasComplementares.adicionarAtividade)

export default router
