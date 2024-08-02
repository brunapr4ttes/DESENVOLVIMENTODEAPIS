import conn from "../config/conn.js"
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import createUserToken from "../helpers/createUserToken.js"

//Criar usuário
export const register = (request, response) => {

    const {nome, email, telefone, senha, confirmsenha} = request.body

    const checkEmailSQL = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
    const checkEmailData = ["email", email]

    conn.query(checkEmailSQL, checkEmailData, async (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({err: 'Não foi possível buscar usuário'})
            return
        }

        if(data.length > 0){
            response.status(409).json({message: 'Email já está em uso!'})
            return
        }

        //criar a senha do usuario
        const salt = await bcrypt.genSalt(12) // instrução asíncrona, precisa esperar receber algo para construir
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log(salt) // 12 para evitar que existam senhas iguas no banco de dados
        // console.log("Senha recebida: ", senha)
        // console.log("Senha Criptografada: ", senhaHash)

        // CADASTRAR USUÁRIO
        const id = uuidv4()
        const imagem = 'userDefault.png'

        const insertSql = /*sql*/ `insert into usuarios(??, ??, ??, ??, ??, ??)
        values(?, ?, ?, ?, ?, ?)`

        const insertData = ['usuario_id', 'nome', 'email', 'telefone', 'senha', 'imagem', id, nome, email, telefone, senha, imagem]

        conn.query(insertSql, insertData, (err)=>{
            if(err){
                console.error(err)
                response.status(500).json({err: 'Erro ao cadastrar usuário'})
                return
            }
            const usuarioSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
            const usuarioData = ["usuario_id", id]
            conn.query(usuarioSql, usuarioData, async (err, data)=>{
                if(err){
                    console.err();
                    response.status(500).json({err: "Erro ao selecionar usuário"})
                    return;
                }
                const usuario = data[0]

                try{
                    await createUserToken(usuario, request, response)
                } catch (error) {
                    console.error(error)
                }
            })
            //usuário esteja logado na aplicação
            //createUserToken()
            response.status(201).json({message: "Usuário cadastrado"})
        })
    })
}

//Login
export const login = (request, response) =>{
    const {email, senha} = request.body

    //validações
    if(!email){
        response.status(400).json({err: "O email é obrigatório"})
    }
    if(!senha){
        response.status(400).json({err: "A senha é obrigatória"})
    }
    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
    const checkData = ['email', email]
    conn.query(checkSql, checkData, async (err, data)=>{
        if(err){
            console.log(err)
            response.statis(500).json({err: "Erro ao buscar usuário"})
            return;
        }
        if(data.length === 0){
            response.status(404).json({err: "Usuário não encontrado"})
            return;
        }
        const usuario = data[0]

        //Verificar se a senha existe (comparar senha)

        const compararSenha = await bcrypt.compare(senha, usuario.senha)
        // console.log("Senha do usuário: ", senha)
        // console.log("Senha do objeto: ", usuario.senha)
        // console.log("Comparar senha ", compararSenha )
        if(!compararSenha){
            response.status(401).json({msg: 'Senha inválida'})
        }

        try{
            await createUserToken(usuario, request, response)
        } catch (error) {
            console.log(error)
            response.status(500).json({err: "Erro ao processar informação"})
        }
    })
}

export const checkUser = (request, response) => {
    let usuarioAtual
    // armazenar o token do usuario que está logado na aplicação

    if(request.headers.authorization){
        const token = getToken(request)
        
        const decoded = jwt.decode(token, "SENHASUPERSEGURAEDIFICIL") // função para decodificar o token
        
        const usuarioId = decoded.id

        const checkSql = /*sql*/ `select * from usuarios where ?? = ?`
        const checkData = ['usuario_id', usuarioId]
        conn.query(checkSql, checkData, (err, data)=>{
            if(err){
                console.error(err)
                response.status(500).json({err: 'Erro ao verificar usuário'})
                return
            }

            usuarioAtual = data[0]
            response.status(200).json(usuarioAtual)
        })
    }else{

    }
    // criar um helper para fazer a verificação
}

export const getUserById = (request, response) => {
    const {id} = request.params
    const checkSql = /*sql*/ `SELECT usuario_id, nome, email, telefone, imagem FROM usuarios WHERE ?? = ??`;
    const checkData = ["usuarios_id", id]
    conn.query(checkSql, checkData, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({msg:"Erro ao buscar usuário"})
            return
        }
        if(data.length === 0 ){
            response.status(404).json({msg: "Usuário não encontrado"})
            return
        }
        const usuario = data[0]
        response.status(200).json(usuario)
    })
}

export const editUser = (request, response) =>{
    const {id} = request.params

    //verificar se o usuário está logado a partir do token
    const token = getToken(request)
    console.log(token) 
}