import conn from "../config/conn.js"
import {v4 as uuidv4} from 'uuid'

export const getFuncionario = (request, response)=>{
    const sql = /*sql*/`SELECT * FROM funcionarios`

    conn.query(sql, (err, data)=>{
        if(err){
        console.error(err)
        response.status(500).json({message: "Erro ao buscar todos os funcionarios"}) 
        return   
        }
        const livros = data
        response.status(200).json(livros)
    })
}

export const cadastrarFuncionario = (request, response)=>{
    const {nome, cargo, data_contratacao, salario, email} = request.body

    if(!nome){
        response.status(500).json({message: "Nome do funcionário é obrigatório"})
        return
    }
    if(!cargo){
        response.status(500).json({message: "cargo do funcionário é obrigatório"})
        return
    }if(!data_contratacao){
        response.status(500).json({message: "A data de contratação do funcionário é obrigatório"})
        return
    }if(!salario){
        response.status(500).json({message: "salario do funcionário é obrigatório"})
        return
    }if(!email.includes('@')){
        response.status(500).json({message: "email do funcionário é obrigatório"})
        return
    }

    
        // verifica se o email consta no banco de dados
    const checkSql = /*sql*/ `
    SELECT * FROM funcionarios
    WHERE email = "${email}"
    `
    
    conn.query(checkSql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Não foi possível verificar se o funcionário possuí registro"})
            return
        }
        if(data.length > 0){
            response.status(409).json({message: "Funcionário já cadastrado com esse email"})
            return
        }

        const id = uuidv4()

        const insertSql = /*sql*/ `INSERT INTO funcionarios(id, nome, cargo, data_contratacao, salario, email)
        VALUES("${id}","${nome}","${cargo}","${data_contratacao}","${salario}","${email}")`

        conn.query(insertSql, (err)=>{
            if(err){
                console.error(err)
                response.status(500).json({message: "Erro ao cadastrar funcionário"})
                return
            }

            response.status(201).json({message: "Funcionário cadastrado!"})
        })
    })
}

export const buscarFuncionario = (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/ `SELECT * FROM funcionarios WHERE id = "${id}"`
    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao tentar buscar funcionário"})
            return
        }

        if(data.length === 0){
            response.status(404).json({message: "Funcionário não encontrado!"})
            return
        }

        const funcionario = data[0]
        response.status(200).json(funcionario)
    })
}

export const editarFuncionario = (request,response)=>{
    const {id} = request.params
    const {nome, cargo, data_contratacao, salario, email} = request.body

    if(!nome){
        response.status(500).json({message: "Nome do funcionário é obrigatório"})
        return
    }
    if(!cargo){
        response.status(500).json({message: "cargo do funcionário é obrigatório"})
        return
    }if(!data_contratacao){
        response.status(500).json({message: "A data de contratação do funcionário é obrigatório"})
        return
    }if(!salario){
        response.status(500).json({message: "salario do funcionário é obrigatório"})
        return
    }if(!email.includes("@")){
        response.status(500).json({message: "email do funcionário é obrigatório"})
        return
    }

    const checkSql = /*sql*/ `SELECT * FROM funcionarios WHERE id = "${id}"`

    conn.query(checkSql, (err, data)=>{
        if(err){
            console.log(err)
            response.status(500).json({message: "Erro ao verificar se funcionário já está cadastrado"})
            return
        }

        if(data.length === 0){
            response.status(404).json({message: "Funcionário não existe no banco de dados"})
            return
        }

        const checkSqlEmail = /*sql*/ `
        SELECT * FROM funcionarios
        WHERE email = "${email}"`

        conn.query(checkSqlEmail, (err, data)=>{
            if(err){
                console.error(err)
                response.status(500).json({message: "Erro ao verificar se email já está cadastrado"})
                return
            }
            if(data.length > 0){
                response.status(409).json({message: "Funcionário já possui esse email"})
                return
            }

            const updateSql = /*sql*/ `UPDATE funcionarios SET nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}", salario = "${salario}", email = "${email}" WHERE id = "${id}"`

        

        conn.query(updateSql, (err, data)=>{
            if(err){
                console.error(err)
                response.status(500).json({message: 'Erro ao atualizar funcionário'})
                return
            }
            response.status(201).json({message: 'Informções atualizadas!'})
        })
        })

        
    })
}

export const deletarFuncionario = (request, response)=>{
    const {id} = request.params

    const deleteSql = /*sql*/ `delete from funcionarios where id = "${id}"`
    conn.query(deleteSql, (err, info)=>{
        if(err){
            console.log(err)
            response.status(500).json({message: "Erro ao deletar funcionário"})
            return
        }
        if(info.affectedRows === 0){
            response.status(404).json({message: "Funcionário não encontrado"})
        }

        response.status(201).json({message: 'Funcionário deletado!'})
    })
}