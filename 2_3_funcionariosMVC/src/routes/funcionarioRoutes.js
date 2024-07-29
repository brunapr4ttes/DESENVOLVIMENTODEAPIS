import {Router} from 'express' // responsável pelas rotas do express

// import controllers
import { cadastrarFuncionario, getFuncionario, buscarFuncionario, editarFuncionario, deletarFuncionario } from '../controllers/funcionariosController.js';

const router = Router()

router.get('/', getFuncionario)
router.post('/criar', cadastrarFuncionario)
router.get('/:id', buscarFuncionario)
router.put('/editar/:id', editarFuncionario)
router.delete('/remover/:id', deletarFuncionario)

export default router; // exporta o router já que ele possui todas as rotas que colocamos aqui nesse arquivo