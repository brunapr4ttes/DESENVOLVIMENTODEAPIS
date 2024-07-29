import conn from "../config/conn.js"
import {v4 as uuidv4} from 'uuid'

export const getEmprestimo = (request, response)=>{
    const sql = /*sql*/ `select * from emprestimos`

    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao consultar tabela de emprestimos"})
            return
        }
        const emprestimos = data
        response.status(200).json(emprestimos)
    })
}

export const cadastrarEmprestimo = (request, response)=>{
    const {cliente_id, livro_id, data_emprestimo, data_devolucao} = request.body

    if(!cliente_id){
        response.status(400).json({message: 'O cliente_id é obrigatório!'})
        return
    }
    if(!livro_id){
        response.status(400).json({message: 'O livro_id é obrigatório!'})
        return
    }
    if(!data_emprestimo){
        response.status(400).json({message: 'A data do emprestimo é obrigatória!'})
        return
    }
    if(!data_devolucao){
        response.status(400).json({message: 'A data da devolucao é obrigatória!'})
        return
    }

    const checkSqlCliente = /*sql*/ `select * from clientes 
    where ?? = ?`

    const checkSqlClienteData = [
        "cliente_id",
        cliente_id
    ]

    conn.query(checkSqlCliente, checkSqlClienteData, (err)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao verificar se já existe um cliente cadastrado"})
            return
        }
    })

    const checkSqlLivro = /*sql*/ `select * from livros
    where ?? = ?`

    const checkSqlLivroData = [
        "livro_id",
        livro_id
    ]

    conn.query(checkSqlLivro, checkSqlLivroData, (err)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao verificar se já existe um livro cadastrado"})
            return
        }
    })
}

export const buscarEmprestimo = (request, response)=>{
}

export const editarEmprestimo = (request,response)=>{
}

export const deletarEmprestimo = (request, response)=>{
}