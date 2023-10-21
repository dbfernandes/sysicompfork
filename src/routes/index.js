/* Import routes */
import express from "express";
import inicioRoutes from "./inicio.routes";
import autenticacaoRoutes from "./autenticacao.routes";
import usuariosRoutes from "./usuarios.routes";
import projetosRoutes from "./projetos.routes";
import editalRouter from "./edital.routes";
import selecaoppgiRouter from "./selecaoppgi.routes";
import linhasDePesquisaRouter from "./linhasDePesquisa.routes";
import salasRoutes from './salas.routes';
import perfilRoutes from './perfil.routes';
import autenticacaoController from '../controllers/autenticacaoController';
import reservasRoutes from "./reservas.routes"
import horasComplementaresRoutes from './horasComplementares.routes'
import afastamentoTemporarioRoutes from './afastamentoTemporario.routes';
const router = express.Router();

//const { isUsuarioAutenticado } = require('../utils/autenticacao-middleware')


/* Add routes */
//router.use('/', isUsuarioAutenticado)
// router.use('/', autenticacaoRoutes)
//router.use('/inscricao', inscricaoRouter);


// ROTAS DE AUTENTICAÇÃO 

router.get('/login', autenticacaoController.login)
router.post('/login', autenticacaoController.login)
router.get('/recuperar-senha',autenticacaoController.recuperar_senha )
router.post('/recuperar-senha',autenticacaoController.recuperar_senha)
router.get('/logout', autenticacaoController.logout)

router.use("/selecaoppgi", selecaoppgiRouter);

router.use(autenticacaoController.verificar)

router.use('//', (req, res) => res.redirect('/inicio'));
router.use("/inicio", inicioRoutes);
router.use("/perfil", perfilRoutes);

// Rotas Exclusivas Administrador e Secretaria 
router.use("/usuarios", autenticacaoController.autorizarAdmin, usuariosRoutes);
//router.use("/projetos", projetosRoutes);
// Rotas Exclusivas Coordenador
router.use("/edital", autenticacaoController.autorizarCoord, editalRouter);
router.use("/linhasdepesquisa", autenticacaoController.autorizarCoord, linhasDePesquisaRouter);
// Rotas Exclusivas Professor
router.use('/salas', autenticacaoController.autorizarProf, salasRoutes);
router.use('/reservas', autenticacaoController.autorizarProf, reservasRoutes);
router.use("/horascomplementares", autenticacaoController.autorizarProf, horasComplementaresRoutes)
export default router;
