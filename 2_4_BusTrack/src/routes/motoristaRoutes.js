import {Router} from 'express'

import { deleteMotorista, getIdMotorista, getMotorista, postMotorista } from '../controllers/motoristaController.js'

const router = Router()

router.post('/create', postMotorista)
router.get('/', getMotorista)
router.get('/:motorista_id', getIdMotorista)
router.delete('/delete/:motorista_id', deleteMotorista)

export default router