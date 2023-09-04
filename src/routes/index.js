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
import autenticacaoController from '../controllers/auntenticacaoController';

import horasComplementaresRoutes from './horasComplementares.routes'
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

router.use(autenticacaoController.verificar)

router.use('//', (req, res) => res.redirect('/inicio'));
router.use("/inicio", inicioRoutes);

router.use("/usuarios", usuariosRoutes);
router.use("/projetos", projetosRoutes);
router.use("/selecaoppgi", selecaoppgiRouter);
router.use("/edital", editalRouter);
router.use("/linhasdepesquisa", linhasDePesquisaRouter);
router.use('/salas', salasRoutes);
router.use("/horascomplementares", horasComplementaresRoutes)
export default router;
