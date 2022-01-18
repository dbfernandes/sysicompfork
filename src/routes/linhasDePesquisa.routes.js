import express from "express";
import linhasDePesquisaController from "../controllers/linhasDePesquisaController";
const router = express.Router();

router.get('/listar', linhasDePesquisaController.listar);

router.get('/busca/:id', linhasDePesquisaController.buscar);

export default router;
