import {Router} from 'express'

import { getIdLinhas, getLinhas, postLinhas, putLinhas } from '../controllers/linhasController.js'

const router = Router()

router.post('/create', postLinhas)
router.get('/', getLinhas)
router.get('/:linha_id', getIdLinhas)
router.put('/update/:linha_id', putLinhas)

export default router