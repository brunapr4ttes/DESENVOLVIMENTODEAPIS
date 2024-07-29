import {Router} from 'express';

//import controllers
import { getLivros, cadastrarLivros, buscarLivros, editarLivros, deletarLivros } from '../controllers/livrosController.js';

const router = Router();

router.get("/", getLivros);
router.post("/criar", cadastrarLivros);
router.get("/:id", buscarLivros);
router.put("/editar/:id", editarLivros);
router.delete("/remover/:id", deletarLivros);

export default router;