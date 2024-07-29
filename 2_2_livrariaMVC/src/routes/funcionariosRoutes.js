import {Router} from 'express';

//import controllers
import { getFuncionarios, cadastrarFuncionarios, buscarFuncionarios, editarFuncionarios, deletarFuncionarios } from '../controllers/funcionariosController.js';

const router = Router();

router.get("/", getFuncionarios);
router.post("/criar", cadastrarFuncionarios);
router.get("/:id", buscarFuncionarios);
router.put("/editar/:id", editarFuncionarios);
router.delete("/remover/:id", deletarFuncionarios);

export default router;