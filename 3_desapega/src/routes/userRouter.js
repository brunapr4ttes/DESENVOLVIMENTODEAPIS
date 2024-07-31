import { Router } from "express";

import { register } from "../controllers/usuarioController.js";

//importar os helpers
import validarUsuario from "../helpers/validar_user.js";

const router = Router()

//localhost:3333/usuarios/register
router.post('/register', validarUsuario, register)

export default router;