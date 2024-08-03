import { Router } from "express";

import { create } from '../controllers/objetoController.js'

//helpers
import verifyToken from "../helpers/verifyToken.js";
import imageUpload from "../helpers/imageUpload.js";


const router = Router()
router.post('/create', verifyToken, imageUpload.array("imagens", 10), create)

export default router;