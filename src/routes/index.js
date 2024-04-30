/* Import routes */
import express from 'express'
import inicioRoutes from './inicio.routes'
import usuariosRoutes from './usuarios.routes'
import editalRouter from './edital.routes'
import selecaoppgiRouter from './selecaoppgi.routes'
import numerosIcompRouter from './numerosIcomp.routes'
import linhasDePesquisaRouter from './linhasDePesquisa.routes'
import salasRoutes from './salas.routes'
import perfilRoutes from './perfil.routes'
import autenticacaoController from '../controllers/autenticacaoController'
import reservasRoutes from './reservas.routes'
import horasComplementaresRoutes from './horasComplementares.routes'
import afastamentoTemporarioRoutes from './afastamentoTemporario.routes'
import pdfController from '../controllers/exportToPDF'
import editalController from '../controllers/editalController'
import curriculoRoutes from './curriculo.routes'
import alunosRoutes from './alunos.routes'
const router = express.Router()

// ROTAS DE AUTENTICAÇÃO

router.get('/login', autenticacaoController.login)
router.post('/login', autenticacaoController.login)
router.get('/recuperar-senha', autenticacaoController.recuperarSenha)
router.post('/recuperar-senha', autenticacaoController.recuperarSenha)
router.get('/logout', autenticacaoController.logout)

router.use('/selecaoppgi', selecaoppgiRouter)

router.use('/numerosIcomp', numerosIcompRouter)

router.use('/inicio', inicioRoutes)
router.use('/perfil', perfilRoutes)

// Rotas Exclusivas Administrador e Secretaria
router.use('/usuarios', autenticacaoController.autorizarAdmin, usuariosRoutes)
// router.use("/projetos", projetosRoutes);
// Rotas Exclusivas Coordenador
router.use('/edital', autenticacaoController.autorizarCoord, editalRouter)
router.use('/linhasdepesquisa', autenticacaoController.autorizarCoord, linhasDePesquisaRouter)
// Rotas Exclusivas Professor
router.use('/salas', autenticacaoController.autorizarProf, salasRoutes)
router.use('/reservas', autenticacaoController.autorizarProf, reservasRoutes)
router.use('/horascomplementares', autenticacaoController.autorizarProf, horasComplementaresRoutes)
router.use('/afastamentotemporario', autenticacaoController.autorizarProf, afastamentoTemporarioRoutes)
router.use('/gerarPDF/:id', pdfController.gerarPDF)
router.use('/gerarCandidatoPDF/:id', editalController.gerarCandidatoPDF)
router.use('/lattes', autenticacaoController.autorizarProf, curriculoRoutes)
// Rotas Exclusivas Secretaria
router.use('/alunos', autenticacaoController.autorizarAdmin, alunosRoutes)
export default router
