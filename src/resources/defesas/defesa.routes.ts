import express from 'express';
import defesaController from './defesa.controller';
import defesaUpload from './defesa.multer.config';
import autenticacaoController from '../autenticacao/autenticacao.controller'; // Ajuste o caminho conforme necessário
import { isAuth } from '@/middlewares/usuarioAutenticacaoMiddleware';

const router = express.Router();

router.all('/adicionar', defesaController.criarDefesa);
router.post('/excluir/:id', defesaController.excluirDefesa);
router.get('/listar', defesaController.viewList);

router.get('/gerenciar', defesaController.viewManagementList);
router.post('/processar-aprovacao/:id', defesaController.processApproval);
router.get('/revisar/:id', defesaController.viewReviewPage);

// wizard qualificação
router.get('/editar/:id/qualificacao/step1', defesaController.viewQualiStep1);
router.post('/editar/:id/qualificacao/step1', defesaController.saveQualiStep1);
router.get('/editar/:id/qualificacao/step2', defesaController.viewQualiStep2);
router.post('/editar/:id/qualificacao/step2', defesaController.saveQualiStep2);
router.get('/editar/:id/qualificacao/step3', defesaController.viewQualiStep3);
router.post('/editar/:id/qualificacao/step3', defesaController.saveQualiStep3);
router.get('/editar/:id/qualificacao/step4', defesaController.viewQualiStep4);
router.post('/editar/:id/qualificacao/step4', defesaController.saveQualiStep4);
router.get('/editar/:id/qualificacao/step5', defesaController.viewQualiStep5);
router.post('/editar/:id/qualificacao/step5', defesaController.saveQualiStep5);
router.get('/editar/:id/qualificacao/step6', defesaController.viewQualiStep6);
router.post('/editar/:id/qualificacao/step6', defesaController.saveQualiStep6);
router.get('/editar/:id/qualificacao/step7', defesaController.viewQualiStep7);
router.post(
  '/editar/:id/qualificacao/step7',
  (req, res, next) => { 
    console.log('--- ROTA STEP 7 CHAMADA ---'); 
    next(); 
  },
  defesaUpload.single('propostaPdf'), 
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      console.error('--- ERRO DO MULTER ---:', err); 
    }
    next(err);
  },
  defesaController.saveQualiStep7
);

//rotas de defesa final

router.get('/editar/:id/final/step1', defesaController.viewFinalStep1);
router.post('/editar/:id/final/step1', defesaController.saveFinalStep1);
router.get('/editar/:id/final/step2', defesaController.viewFinalStep2);
router.post('/editar/:id/final/step2', defesaController.saveFinalStep2);
router.get('/editar/:id/final/step3', defesaController.viewFinalStep3);
router.post('/editar/:id/final/step3', defesaController.saveFinalStep3);
router.get('/editar/:id/final/step4', defesaController.viewFinalStep4);
router.post('/editar/:id/final/step4', defesaController.saveFinalStep4);
router.get('/editar/:id/final/step5', defesaController.viewFinalStep5);
router.post('/editar/:id/final/step5', defesaController.saveFinalStep5);
router.get('/editar/:id/final/step6', defesaController.viewFinalStep6);
router.post(
  '/editar/:id/final/step6',
  defesaUpload.single('tesePdf'),
  defesaController.saveFinalStep6
);

// ROTAS DE DIVULGAÇÃO (SECRETARIA)
router.get('/divulgar/:id', isAuth, autenticacaoController.autorizarAdmin, defesaController.viewDivulgarDefesa);

router.post(
  '/divulgar/:id', 
  isAuth, 
  autenticacaoController.autorizarAdmin, 
  defesaUpload.single('portariaFile'),
  defesaController.sendDivulgacaoEmail
);

router.get('/download/:uploadId', defesaController.downloadAnexo);
export default router;
