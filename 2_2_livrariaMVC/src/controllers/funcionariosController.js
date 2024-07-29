import { request } from 'express';
import conn from '../config/conn.js';
import { v4 as uuidv4 } from 'uuid';

export const getFuncionarios = (request, response) => {
    const sql = /*sql*/ `SELECT * FROM funcionarios`
    conn.query(sql, (err, data) => {
        if (err) {
            response.status(500).json({ message: 'Erro ao buscar os funcionarios' })
            return console.log(err)
        }
        const funcionarios = data
        console.log(data)
        console.log(typeof data)
        response.status(200).json(funcionarios)
    })
};

export const cadastrarFuncionarios = (request, response) => {
    const { nome, cargo, data_contratacao, salario, email } = request.body

    if (!nome) {
        response.status(400).json({ message: 'O nome é obrigatório!' })
        return
    }
    if (!cargo) {
        response.status(400).json({ message: 'O cargo é obrigatório!' })
        return
    }
    if (!data_contratacao) {
        response.status(400).json({ message: 'A data de contratação é obrigatória!' })
        return
    }
    if (!salario) {
        response.status(400).json({ message: 'O salário é obrigatório!' })
        return
    }
    if (!email.includes("@")) {
        response.status(422).json({ message: 'O email é obrigatório!' })
        return
    }

    const checkSql = /*sql*/ `
    SELECT * FROM funcionarios 
    WHERE email = "${email}" 
    `;

    conn.query(checkSql, (err, data) => {
        if (err) {
            response.status(500).json({ message: "Erro ao buscar os funcionarios" })
            return console.log(err)
        }
        if (data.length > 0) {
            response.status(409).json({ message: 'o Email já existe!' })
            return console.log(err)
        }

        const id = uuidv4()
        const insertSql = /*sql*/ `insert into funcionarios(id, nome, cargo, data_contratacao, salario, email) 
        values("${id}","${nome}","${cargo}","${data_contratacao}","${salario}","${email}");`

        conn.query(insertSql, (err) => {
            if (err) {
                console.log(err)
                response.status(500).json({ message: 'Erro ao cadastrar o funcionario' })
                return
            }
            response.status(201).json({ message: 'Funcionario cadastrado' })
        })
    })
};

export const buscarFuncionarios = (request, response) => {
    const { id } = request.params

    const sql = /*sql*/`SELECT * FROM funcionarios WHERE id = "${id}"`
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao buscar funcionário" })
            return
        }
        if (data.length === 0) {
            response.status(404).json({ message: "Funcionário não encontrado" })
            return
        }
        response.status(200).json(data)
    })
}

export const editarFuncionarios = (request, response) => {
    const { id } = request.params

    const { nome, cargo, data_contratacao, salario, email } = request.body;

    if (!nome) {
        response.status(400).json({ message: 'O nome é obrigatório!' });
        return
    }
    if (!cargo) {
        response.status(400).json({ message: 'O cargo é obrigatório!' });
        return
    }
    if (!data_contratacao) {
        response.status(400).json({ message: 'A data de contratação é obrigatória!' });
        return
    }
    if (!salario) {
        response.status(400).json({ message: 'O salario é obrigatório!' });
        return
    }
    if (!email.includes("@")) {
        response.status(422).json({ message: 'O email é obrigatório!' })
        return
    }

    const checkSql = /*sql*/ `SELECT * FROM funcionarios WHERE id = "${id}"`

    conn.query(checkSql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao buscar funcionarios" })
            return
        }
        if (data.length === 0) {
            return response.status(404).json({ message: "Funcionario não encontrado" })
        }

        const checkSqlEmail = /*sql*/`SELECT * FROM funcionarios WHERE email = "${email}" AND id != "${id}"`

        conn.query(checkSqlEmail, (err, data) => {
            console.log(data)
            if (err) {
                console.error(err)
                response.status(500).json({ message: "Erro ao verificar se email já está cadastrado" })
                return
            }
            if (data.length > 0) {
                console.log(err)
                response.status(409).json({ message: "Funcionário existente já possui esse email" })
                return
            }
        })
        const updateSql = /*sql*/`UPDATE funcionarios SET nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}", salario = "${salario}", email = "${email}" WHERE id = "${id}"`
        conn.query(updateSql, (err) => {
            if (err) {
                console.error(err)
                response.status(500).json({ message: "Erro ao atualizar funcionário" })
                return
            }
            response.status(200).json({ message: "Funcionário atualizado" })
        })
    })
}

export const deletarFuncionarios = (request, response) => {
    const { id } = request.params

    const deleteSql = /*sql*/ `DELETE FROM funcionarios WHERE id = "${id}"`
    conn.query(deleteSql, (err, info) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao deletar funcionário" })
            return
        }

        if (info.affectedRows === 0) {
            response.status(404).json({ message: "Funcionário não encontrado" })
            return
        }

        response.status(204).json({ message: "Funcionário selecionado foi deletado" })
    })
}