import jwt from "jsonwebtoken"

//Assíncrono
const createUserToken = async (usuario, request, response) => {
    //Criar o token
    const token = jwt.sign(
        {
            nome: usuario.nome,
            id: usuario.usuario_id
        },
        "SENHASUPERSEGURAEDIFICIL" //Senha
    )
    //Retornar o token
    response.status(200).json({
        msg: "Você está logado!",
        token: token,
        usuario_id: usuario.usuario_id
    })
}

export default createUserToken