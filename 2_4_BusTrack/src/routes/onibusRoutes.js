import {Router} from 'express'

import { getIdOnibus, getOnibus, postOnibus, todosOsDados } from '../controllers/onibusController.js'

const router = Router()

router.post('/create', postOnibus)
router.get('/', getOnibus)
router.get('/:onibus_id', getIdOnibus)
router.get('/todosOsDados', todosOsDados)


export default router