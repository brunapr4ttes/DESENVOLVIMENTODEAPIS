import { request } from 'express';
import conn from '../config/conn.js';
import { v4 as uuidv4 } from 'uuid';

export const getClientes = (request, response) => {
    const sql =  /*sql*/ `SELECT * FROM clientes`;
    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar clientes"});
            return;
        }
        const clientes = data 
        response.status(200).json(clientes);
    });
};

export const cadastrarClientes = (request, response) => {
    const { nome, email, senha, imagem} = request.body

    if (!nome) {
        response.status(400).json({ message: 'O nome é obrigatório!' })
        return
    }
    if (!senha) {
        response.status(400).json({ message: 'O cargo é obrigatório!' })
        return
    }
    if (!imagem) {
        response.status(400).json({ message: 'O salário é obrigatório!' })
        return
    }
    if (!email.includes("@")) {
        response.status(422).json({ message: 'O email é obrigatório!' })
        return
    }

    const checkSql = /*sql*/ `
    SELECT * FROM clientes 
    WHERE email = "${email}" 
    `;

    conn.query(checkSql, (err, data) => {
        if (err) {
            response.status(500).json({ message: "Erro ao buscar os clientes" })
            return console.log(err)
        }
        if (data.length > 0) {
            response.status(409).json({ message: 'o Email já existe!' })
            return console.log(err)
        }

        const id = uuidv4()
        const insertSql = /*sql*/ `insert into clientes(id, nome, email, senha, imagem) 
        values("${id}","${nome}","${email}","${senha}","${imagem}");`

        conn.query(insertSql, (err) => {
            if (err) {
                console.log(err)
                response.status(500).json({ message: 'Erro ao cadastrar o cliente' })
                return
            }
            response.status(201).json({ message: 'Cliente cadastrado' })
        })
    })
};

export const buscarClientes = (request, response) => {
    const { id } = request.params

    const sql = /*sql*/`SELECT * FROM clientes WHERE id = "${id}"`
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao buscar cliente" })
            return
        }
        if (data.length === 0) {
            response.status(404).json({ message: "Cliente não encontrado" })
            return
        }
        response.status(200).json(data)
    })
}

export const editarClientes = (request, response) => {
    const { id } = request.params

    const { nome, email, senha, imagem} = request.body;

    if (!nome) {
        response.status(400).json({ message: 'O nome é obrigatório!' });
        return
    }
    if (!imagem) {
        response.status(400).json({ message: 'A imagem é obrigatória!' });
        return
    }
    if (!senha) {
        response.status(400).json({ message: 'A senha de contratação é obrigatória!' });
        return
    }
    if (!email.includes("@")) {
        response.status(422).json({ message: 'O email é obrigatório!' })
        return
    }

    const checkSql = /*sql*/ `SELECT * FROM clientes WHERE id = "${id}"`

    conn.query(checkSql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao buscar clientes" })
            return
        }
        if (data.length === 0) {
            return response.status(404).json({ message: "Clientes não encontrado" })
        }

        const checkSqlEmail = /*sql*/`SELECT * FROM clientes WHERE email = "${email}" AND id != "${id}"`

        conn.query(checkSqlEmail, (err, data) => {
            console.log(data)
            if (err) {
                console.error(err)
                response.status(500).json({ message: "Erro ao verificar se email já está cadastrado" })
                return
            }
            if (data.length > 0) {
                console.log(err)
                response.status(409).json({ message: "Cliente existente já possui esse email" })
                return
            }
        })
        const updateSql = /*sql*/`UPDATE clientes SET nome = "${nome}", email = "${email}", senha = "${senha}", imagem = "${imagem}" WHERE id = "${id}"`
        conn.query(updateSql, (err) => {
            if (err) {
                console.error(err)
                response.status(500).json({ message: "Erro ao atualizar cliente" })
                return
            }
            response.status(200).json({ message: "Cliente atualizado" })
        })
    })
}
