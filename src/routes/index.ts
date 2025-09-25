/* Import routes */
import express from 'express';
import inicioRoutes from '../resources/inicio/inicio.routes';
import usuariosRoutes from '../resources/usuarios/usuario.routes';
import editalRouter from '../resources/edital/edital.routes';
import selecaoppgiRouter from '../resources/selecaoPPGI/selecao.ppgi.routes';
import numerosIcompRouter from '../resources/numerosIcomp/numerosIcomp.routes';
import linhasDePesquisaRouter from '../resources/linhasDePesquisa/linha.de.pesquisa.router';
import salasRoutes from '../resources/salas/sala.routes';
import perfilRoutes from '../resources/perfil/perfil.routes';
import autenticacaoController from '../resources/autenticacao/autenticacao.controller';
import reservasRoutes from '../resources/reservasDeSalas/reservas.routes';
import horasComplementaresRoutes from '../resources/horasComplementares/horas.complementares.routes';
import afastamentoTemporarioRoutes from '../resources/afastamentoTemporario/afastamento.temporario.routes';
import { criarAfastamentoPDF } from '@utils/criarAfastamentoPDF';
import editalController from '../resources/edital/edital.controller';
import curriculoRoutes from '../resources/curriculo/curriculo.routes';
import alunosRoutes from '../resources/alunos/aluno.routes';
import defesasRoutes from '../resources/defesas/defesa.routes';

import { isAuth } from '@/middlewares/usuarioAutenticacaoMiddleware';

const router = express.Router();

// ROTAS DE OUTROS PROJETOS
router.use('/selecaoppgi', selecaoppgiRouter);
router.use('/numerosIcomp', numerosIcompRouter);

router.get('/changeLanguage/:lang', (req, res) => {
  const supportedLanguages = ['en', 'ptBR']; // Exemplo de idiomas suportados
  const lang = req.params.lang;

  if (supportedLanguages.includes(lang)) {
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
  }

  const referer = req.get('referer') || '/'; // Fallback para a home
  res.redirect(referer);
});

// ROTAS DE AUTENTICAÇÃO
router.get('/login', autenticacaoController.login);
router.post('/login', autenticacaoController.login);

router.get('/recuperarSenha', autenticacaoController.recuperarSenha);
router.post('/recuperarSenha', autenticacaoController.recuperarSenha);

router.get('/logout', autenticacaoController.logout);

router.get('/alterarSenha', autenticacaoController.trocaSenha);
router.put('/alterarSenha', autenticacaoController.trocaSenha);

router.use(isAuth);
router.use('//', (req, res) => res.redirect('/inicio'));
router.use('/inicio', inicioRoutes);
router.use('/perfil', perfilRoutes);

// Rotas Exclusivas Administrador e Secretaria
// router.use('/usuarios', autenticacaoController.autorizarAdmin, usuariosRoutes);
router.use('/usuarios', usuariosRoutes);
// router.use("/projetos", projetosRoutes);
// Rotas Exclusivas Coordenador
// router.use('/edital', autenticacaoController.autorizarCoord, editalRouter);
router.use('/edital', editalRouter);
// router.use(
//   '/linhasdepesquisa',
//   autenticacaoController.autorizarCoord,
//   linhasDePesquisaRouter,
// );
router.use('/linhasdepesquisa', linhasDePesquisaRouter);
// Rotas Exclusivas Professor
router.use('/salas', autenticacaoController.autorizarProf, salasRoutes);
router.use('/reservas', autenticacaoController.autorizarProf, reservasRoutes);
router.use(
  '/horascomplementares',
  autenticacaoController.autorizarProf,
  horasComplementaresRoutes,
);
router.use(
  '/afastamentotemporario',
  // autenticacaoController.autorizarProf,
  afastamentoTemporarioRoutes,
);
router.use('/gerarPDF/:id', criarAfastamentoPDF);

////////////////////////////////////
router.use(
  '/downloadCandidateDocument/:id',
  editalController.pegarDocumentoCandidato,
);
router.use('/lattes', autenticacaoController.autorizarProf, curriculoRoutes);
// Rotas Exclusivas Secretaria
router.use('/alunos', autenticacaoController.autorizarAdmin, alunosRoutes);
router.use('/defesas', defesasRoutes)
export default router;
