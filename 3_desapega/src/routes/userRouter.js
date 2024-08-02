import { Router } from "express";

import { checkUser, register, login, getUserById, editUser } from "../controllers/userController.js";

//importar os helpers
import validarUsuario from "../helpers/validarUser.js";
import verifyToken from "../helpers/verifyToken.js";

const router = Router()

//localhost:3333/usuarios/register
router.post('/register',validarUsuario, register)
router.post('/login', login)
router.get('/checkuser', checkUser)
router.get('/:id', getUserById)
router.put('/edit/:id', editUser)


export default router;