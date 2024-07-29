import {Router} from 'express';

//import controllers
import { getClientes, cadastrarClientes, buscarClientes, editarClientes} from '../controllers/clientesControllers.js';

const router = Router();

router.get("/", getClientes);
router.post("/criar", cadastrarClientes);
router.get("/:id", buscarClientes);
router.put("/editar/:id", editarClientes);

export default router;