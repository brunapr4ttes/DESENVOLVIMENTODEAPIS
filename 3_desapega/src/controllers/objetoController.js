import getToken from "../helpers/getToken.js"
import getUserByToken from "../helpers/getUserByToken.js"
import { v4 as uuidv4 } from "uuid"
import conn from "../config/conn.js"

export const create = async (request, response) => {
    const { nome, peso, cor, descricao } = request.body
    const disponivel = 1

    //buscar o Token do usuário cadastrado
    const token = getToken(request)
    const user = await getUserByToken(token)

    if (!nome) {
        response.status(400).json("O nome do objeto é obrigatório")
        return
    }
    if (!peso) {
        response.status(400).json("O peso do objeto é obrigatório")
        return
    }
    if (!cor) {
        response.status(400).json("A cor do objeto é obrigatória")
        return
    }
    if (!descricao) {
        response.status(400).json("A descrição do objeto é obrigatória")
        return
    }

    const objeto_id = uuidv4()
    const usuario_id = user.usuario_id
    const insertSql = /*sql*/`INSERT INTO objetos (??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?)`;
    const insertData = [
        "objeto_id", 
        "nome", 
        "peso", 
        "cor", 
        "descricao", 
        "disponivel", 
        "usuario_id", 
        objeto_id, 
        nome, 
        peso, 
        cor, 
        descricao, 
        disponivel, 
        usuario_id,
    ]
    conn.query(insertSql, insertData, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({err: "Erro ao cadastrar objeto"})
            return
        }

        if(request.files){
            //cadastrar no banco
            const insertImageSql = /*sql*/`INSERT INTO objetos_images 
            (image_id, objeto_id, image_path, ) VALUES ?`
            const imageValues = request.files.map((file)=>[
                uuidv4(),
                objeto_id,
                file.filename
            ])
            conn.query(insertImageSql, [imageValues], (err)=>{
                if(err){
                    console.error(err)
                    response.status(500).json({err: "Erro ao salvar imagens do objeto."})
                    return
                }
            })
        }else{

        }
    })
}
