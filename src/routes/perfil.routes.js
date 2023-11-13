import express from 'express'
import perfilRouter from '../controllers/perfilController'
const router = express.Router()

router.get('/', perfilRouter.visualizar)
router.all('/editar', perfilRouter.editar)
router.post('/deletar', perfilRouter.deletar)

export default router