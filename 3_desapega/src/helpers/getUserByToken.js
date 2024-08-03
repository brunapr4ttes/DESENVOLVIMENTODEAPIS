import { response } from 'express'
import jwt from 'jsonwebtoken'
import conn from '../config/conn.js'

const getUserByToken = async (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            response.status(401).json({ err: "Acesso negado!" })
            return
        }

        const decoded = jwt.verify(token, "SENHASUPERSEGURAEDIFICIL")
        // console.log("Função GetUser", decoded)

        const userId = decoded.id
        //console.log("userId: ", userId)

        const checkSql = /*sql*/`
            select * from usuarios where ?? = ?
        `

        const checkData = ["usuario_id", userId]

        conn.query(checkSql, checkData, (err, data) => {
            if (err) {
                reject({ status: 500, message: "Erro ao buscar usuário" })
            } else {
                resolve(data[0])
            }
        })
    })
}

export default getUserByToken