import conn from '../config/conn.js'
import {v4 as uuidv4} from 'uuid'

export const postMotorista = (request, response)=>{
    const {nome, dataNascimento, numeroCarteiraHabilitacao} = request.body

    if(!nome){
        response.status(400).json({message: 'O nome do motorista é obrigatório!'})
        return
    }
    if(!dataNascimento){
        response.status(400).json({message: 'A data de nascimento é obrigatório!'})
        return
    }
    if(!numeroCarteiraHabilitacao){
        response.status(400).json({message: 'O numero da carteira de habilitação é obrigatório!'})
        return
    }

    const checkSql = /*sql*/ `
    select * from motoristas
    where ?? = ? and
    ?? = ? and
    ?? = ?
    `

    const checkSqlData = [
        "nome",
        nome,
        "dataNascimento",
        dataNascimento,
        "numeroCarteiraHabilitacao",
        numeroCarteiraHabilitacao
    ]

    conn.query(checkSql, checkSqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar existência de motorista"})
            return console.error(err)
        }

        if(data.length > 0){
            response.status(409).json({message: "Motorista já cadastrado"})
            return console.log(err)
        }

        const motorista_id = uuidv4()

        const insertSql = /*sql*/ `
        insert into motoristas(??, ??, ??, ??)
        values(?, ?, ?, ?)
        `

        const insertSqlData = [
            "motorista_id",
            "nome",
            "dataNascimento",
            "numeroCarteiraHabilitacao",
            motorista_id,
            nome,
            dataNascimento,
            numeroCarteiraHabilitacao,
        ]

        conn.query(insertSql, insertSqlData, (err)=>{
            if(err){
                response.status(500).json({message: "Erro ao cadastrar motorista"})
                return console.log(err)
            }

            response.status(201).json({message: 'Motorista cadastrado!'})
        })
    })
}

export const getIdMotorista = (request, response)=>{
    const {motorista_id} = request.params

    const sql = /*sql*/ `select * from motoristas where ?? = ?`

    const sqlData = [
        "motorista_id",
        motorista_id
    ]

    conn.query(sql, sqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar motorista"})
            return console.log(err)
        }

        if(data.length === 0){
            response.status(404).json({message: "motorista não encontrado"})
            return console.log(motorista_id)
        }

        const motorista = data[0]
        response.status(200).json(motorista)
    })
}

export const deleteMotorista = (request, response)=>{
    const {motorista_id} = request.params // pega o id que for passado na rota

    const deleteSql = /*sql*/ `delete from motoristas where ?? = ?`

    const deleteSqlData = [
        "motorista_id",
        motorista_id
    ]

    conn.query(deleteSql, deleteSqlData, (err, info)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: 'Erro ao deletar motorista'})
        }
        console.log(info)
        if(info.affectedRows === 0){
            response.status(404).json({messagae: "motorista não encontrado"})
            return
        }

        response.status(200).json({message: 'motorista selecionado foi deletado'})
    })
}

export const getMotorista = (request, response)=>{
    const sql = /*sql*/ `
    select * from motoristas
    `

    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar motoristas existentes"})
            return console.log(err)
        }

        const motoristas = data
        response.status(200).json(motoristas)
    })
}