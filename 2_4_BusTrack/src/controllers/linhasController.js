import conn from '../config/conn.js'
import {v4 as uuidv4} from 'uuid'

export const postLinhas = (request, response)=>{
    const {nomeLinha, numeroLinha, itinerario} = request.body

    if(!nomeLinha){
        response.status(400).json({message: 'O nome da linha é obrigatório!'})
        return
    }
    if(!numeroLinha){
        response.status(400).json({message: 'O numero da linha é obrigatório!'})
        return
    }
    if(!itinerario){
        response.status(400).json({message: 'O itinerário é obrigatório!'})
        return
    }

    const checkSql = /*sql*/ `
    select * from linhas
    where ?? = ? and
    ?? = ? and
    ?? = ?
    `

    const checkSqlData = [
        "nomeLinha",
        nomeLinha,
        "numeroLinha",
        numeroLinha,
        "itinerario",
        itinerario
    ]

    conn.query(checkSql, checkSqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar existência da linha"})
            return console.error(err)
        }

        if(data.length > 0){
            response.status(409).json({message: "Linha já existente"})
            return console.log(err)
        }

        const linha_id = uuidv4()

        const insertSql = /*sql*/ `
        insert into linhas(??, ??, ??, ??)
        values(?, ?, ?, ?)
        `

        const insertSqlData = [
            "linha_id",
            "nomeLinha",
            "numeroLinha",
            "itinerario",
            linha_id,
            nomeLinha,
            numeroLinha,
            itinerario,
        ]

        conn.query(insertSql, insertSqlData, (err)=>{
            if(err){
                response.status(500).json({message: "Erro ao cadastrar linha"})
                return console.log(err)
            }

            response.status(201).json({message: 'Linha cadastrada!'})
        })
    })

}
export const getLinhas = (request, response) =>{
    const sql = /*sql*/ `
    select * from linhas
    `

    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar linhas existentes"})
            return console.log(err)
        }

        const linhas = data
        response.status(200).json(linhas)
    })
}

export const putLinhas = (request, response)=>{
    const {linha_id} = request.params
    const {nomeLinha, numeroLinha, itinerario, onibus_id} = request.body

    if(!nomeLinha){
        response.status(400).json({message: 'O nome da linha é obrigatório!'})
        return
    }
    if(!numeroLinha){
        response.status(400).json({message: 'O numero da linha é obrigatório!'})
        return
    }
    if(!itinerario){
        response.status(400).json({message: 'O itinerário é obrigatório!'})
        return
    }

    const checkSql = /*sql*/ `
    select * from linhas
    where ?? = ? and
    ?? = ? and
    ?? = ?
    `

    const checkSqlData = [
        "nomeLinha",
        nomeLinha,
        "numeroLinha",
        numeroLinha,
        "itinerario",
        itinerario
    ]

    conn.query(checkSql, checkSqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar existência da linha"})
            return console.error(err)
        }

        if(data.length > 0){
            response.status(409).json({message: "Linha já existente"})
            return console.log(err)
        }

        const updateSql = /*sql*/ `update linhas set ?? = ?, ?? = ?, ?? = ?, ?? = ? where ?? = ?`

        const updateSqlData = [
            "nomeLinha",
            nomeLinha,
            "numeroLinha",
            numeroLinha,
            "itinerario",
            itinerario,
            "linha_id",
            linha_id,
            "onibus_id",
            onibus_id
        ]

        conn.query(updateSql, updateSqlData, (err)=>{
            if(err){
                response.status(500).json({message: "Erro ao atualizar linha"})
                return console.log(err)
            }

            response.status(200).json({message: "Linha atualizada!"})
        })
    })
}

export const getIdLinhas = (request, response)=>{
    const {linha_id} = request.params

    const sql = /*sql*/ `select * from linhas where ?? = ?`

    const sqlData = [
        "linha_id",
        linha_id
    ]

    conn.query(sql, sqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar linha"})
            return console.log(err)
        }

        if(data.length === 0){
            response.status(404).json({message: "Linha não encontrada"})
            return console.log(linha_id)
        }

        const linha = data[0]
        response.status(200).json(linha)
    })
}