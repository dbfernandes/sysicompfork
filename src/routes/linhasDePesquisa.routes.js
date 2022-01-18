import express from "express";
import linhasDePesquisaController from "../controllers/linhasDePesquisaController";
const router = express.Router();

router.get('/criar', linhasDePesquisaController.criar);

router.post('/criar', linhasDePesquisaController.criar);

router.get('/listar', linhasDePesquisaController.listar);

router.get('/listar/:id', linhasDePesquisaController.remover);

router.all('/busca/:id', linhasDePesquisaController.buscar);

router.all('/editar/:id', linhasDePesquisaController.editar);


router.post('/busca/:id', linhasDePesquisaController.remover);

export default router;
