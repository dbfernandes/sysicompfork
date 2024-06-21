/* Import routes */
import express from "express";
import inicioRoutes from "../resources/inicio/inicio.routes";
import usuariosRoutes from "../resources/usuarios/usuarios.routes";
import editalRouter from "../resources/edital/edital.routes";
import selecaoppgiRouter from "../resources/selecaoPPGI/selecaoppgi.routes";
import numerosIcompRouter from "../resources/numerosIcomp/numerosIcomp.routes";
import linhasDePesquisaRouter from "../resources/linhasDePesquisa/linhasDePesquisa.router";
import salasRoutes from "../resources/salas/salas.routes";
import perfilRoutes from "../resources/perfil/perfil.routes";
import autenticacaoController from "../resources/autenticacao/autenticacao.controller";
import reservasRoutes from "../resources/reservasDeSalas/reservas.routes";
import horasComplementaresRoutes from "../resources/horasComplementares/horasComplementares.routes";
import afastamentoTemporarioRoutes from "../resources/afastamentoTemporario/afastamentoTemporario.routes";
import pdfController from "../utils/exportToPDF";
import editalController from "../resources/edital/edital.controller";
import curriculoRoutes from "../resources/curriculo/curriculo.routes";
import alunosRoutes from "../resources/alunos/alunos.routes";
const router = express.Router();

// const { isUsuarioAutenticado } = require('../utils/autenticacaoMiddleware')

/* Add routes */
// router.use('/', isUsuarioAutenticado)
// router.use('/', autenticacaoRoutes)
// router.use('/inscricao', inscricaoRouter);

// ROTAS DE AUTENTICAÇÃO

router.get("/login", autenticacaoController.login);
router.post("/login", autenticacaoController.login);
router.get("/recuperar-senha", autenticacaoController.recuperarSenha);
router.post("/recuperar-senha", autenticacaoController.recuperarSenha);
router.get("/logout", autenticacaoController.logout);

router.use("/selecaoppgi", selecaoppgiRouter);

router.use("/numerosIcomp", numerosIcompRouter);

router.use(autenticacaoController.verificar);

router.use("//", (req, res) => res.redirect("/inicio"));
router.use("/inicio", inicioRoutes);
router.use("/perfil", perfilRoutes);

// Rotas Exclusivas Administrador e Secretaria
router.use("/usuarios", autenticacaoController.autorizarAdmin, usuariosRoutes);
// router.use("/projetos", projetosRoutes);
// Rotas Exclusivas Coordenador
router.use("/edital", autenticacaoController.autorizarCoord, editalRouter);
router.use(
  "/linhasdepesquisa",
  autenticacaoController.autorizarCoord,
  linhasDePesquisaRouter
);
// Rotas Exclusivas Professor
router.use("/salas", autenticacaoController.autorizarProf, salasRoutes);
router.use("/reservas", autenticacaoController.autorizarProf, reservasRoutes);
router.use(
  "/horascomplementares",
  autenticacaoController.autorizarProf,
  horasComplementaresRoutes
);
router.use(
  "/afastamentotemporario",
  autenticacaoController.autorizarProf,
  afastamentoTemporarioRoutes
);
router.use("/gerarPDF/:id", pdfController.gerarPDF);
router.use("/gerarCandidatoPDF/:id", editalController.gerarCandidatoPDF);
router.use("/lattes", autenticacaoController.autorizarProf, curriculoRoutes);
// Rotas Exclusivas Secretaria
router.use("/alunos", autenticacaoController.autorizarAdmin, alunosRoutes);
export default router;
