import express from 'express'
import autenticacaoController from './autenticacao.controller'

const router = express.Router()

router.get('/login', autenticacaoController.login)

router.post('/login', autenticacaoController.login)

router.get('/recuperar-senha', autenticacaoController.recuperarSenha)

router.post('/recuperar-senha', autenticacaoController.recuperarSenha)

router.get('/logout', autenticacaoController.logout)

export default router
