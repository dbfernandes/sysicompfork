import express from 'express'
import numerosIcompExceptionController from '../controllers/numerosIcompExceptionController'
import numerosICompInicioController from '../controllers/numerosIcompInicioController'
import numerosICompProfessoresController from '../controllers/numerosIcompProfessoresController'
import numerosICompProjetosController from '../controllers/numerosIcompProjetosController'
import numerosICompAlunosController from '../controllers/numerosIcompAlunosController'
import numerosICompPublicacoesController from '../controllers/numerosIcompPublicacoesController'
import language from '../modules/i18n.js'

const languageMiddleware = (req, res, next) => {
  const { lng } = req.query
  const availableLng = language.i18next.languages
  const defaultLng = language.defaultLng
  if (lng && availableLng.includes(lng)) {
    language.i18next.changeLanguage(lng)
  } else {
    req.query.lng = defaultLng
    language.i18next.changeLanguage(defaultLng)
  }
  next()
}

const router = express.Router()
router.use(languageMiddleware)

// Home
router.all('/', numerosICompInicioController)

// Lista de projetos atuais
router.all('/projetos', numerosICompProjetosController)

// Lista dos alunos egressos
router.all('/alunos/:curso', numerosICompAlunosController)
router.use('/alunos', numerosIcompExceptionController.redirectAlunos)

// Lista das publicações
router.all('/publicacoes', numerosICompPublicacoesController)
router.use('/publicacoes/', numerosIcompExceptionController.redirectPublicacoes)

// Lista de docentes
router.all('/docentes', numerosICompProfessoresController.professores)

// Perfil
router.all('/docentes/:id', numerosICompProfessoresController.perfil)
router.all('/docentes/:id/publicacoes', numerosICompProfessoresController.publicacoes)
router.all('/docentes/:id/projetos', numerosICompProfessoresController.pesquisa)
router.all('/docentes/:id/orientacoes/:tipo', numerosICompProfessoresController.orientacao)
router.all('/docentes/:id/premios', numerosICompProfessoresController.premios)
router.use('/docentes', numerosIcompExceptionController.redirectProfessores)

//* Rota Não Encontrada (404)
router.use(numerosIcompExceptionController.erro404)

export default router
