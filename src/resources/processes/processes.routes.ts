import express from 'express';
import processesController from './processes.controller';
import { uploadXml } from '@resources/processes/processes.multer';

const router = express.Router();

router.get('/', processesController.listProcesses);
router.delete('/:id', processesController.deleteProcess);
// Criar por template (form do modal)
router.post('/criar-por-template', processesController.createByTemplate);

// Upload de XML/BPMN (form do modal)
router.post(
  '/upload-xml',
  uploadXml.single('xmlFile'),
  processesController.createByUpload,
);

// === Visualização / edição ===
router.get('/:id', processesController.viewProcess); // tela de visualização
router.get('/:id/editar', processesController.editProcess); // tela de edição
router.get('/:id/xml', processesController.getXml); // serve o XML puro
router.post('/:id/salvar', processesController.saveXml); // salva XML vindo do editor
router.post('/:id/preview', processesController.savePreview); // salva preview (png/svg base64)

router.get('/:id/preview', processesController.getPreview);

// Excluir
router.delete('/processos/:id', processesController.deleteProcess);

export default router;
