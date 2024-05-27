import express from 'express'
import perfilRouter from './perfil.controller'
const router = express.Router()

router.all('/', perfilRouter.visualizar)
router.all('/editar', perfilRouter.editar)
router.all('/deletar', perfilRouter.deletar)

export default router
