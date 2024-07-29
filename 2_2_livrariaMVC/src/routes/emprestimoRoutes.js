import {Router} from 'express' // responsável pelas rotas do express

// import controllers
import { buscarEmprestimo, cadastrarEmprestimo, deletarEmprestimo, editarEmprestimo, getEmprestimo } from '../controllers/emprestimosController.js';

const router = Router()

router.get('/', getEmprestimo)
router.post('/criar', cadastrarEmprestimo)
router.get('/:emprestimo_id', buscarEmprestimo)
router.put('/editar/:emprestimo_id', editarEmprestimo)
router.delete('/remover/:emprestimo_id', deletarEmprestimo)

export default router; // exporta o router já que ele possui todas as rotas que colocamos aqui nesse arquivo