import express from 'express'
import autenticacaoController from './autenticacao.controller'

const router = express.Router()

router.get('/login', autenticacaoController.login)

router.post('/login', autenticacaoController.login)

router.get('/recuperarSenha', autenticacaoController.recuperarSenha)

router.post('/recuperarSenha', autenticacaoController.recuperarSenha)

router.get('/logout', autenticacaoController.logout)

export default router
