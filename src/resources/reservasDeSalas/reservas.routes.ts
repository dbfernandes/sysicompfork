import express from 'express';
import reservasController from './reservas.controller';

const router = express.Router();

router.all('/adicionar', reservasController.criarReserva);
router.post('/excluir/:id', reservasController.deletarReserva);
router.get('/gerenciar', reservasController.listarReservasFormatadas);
router.get('/listar', reservasController.listarReservas);
router.all('/editar/:id', reservasController.editarReserva);

export default router;
