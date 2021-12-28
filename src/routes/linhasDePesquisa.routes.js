import express from "express";
import linhasDePesquisaController from "../controllers/linhasDePesquisaController";
const router = express.Router();

router.get("/listar", linhasDePesquisaController.listar);

export default router;
