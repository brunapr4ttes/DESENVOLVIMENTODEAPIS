import jwt from "jsonwebtoken";
import getToken from "./getToken.js"

const verifyToken = (request, response, next) => {
    if(!request.headers.authorization){
        return response.status(401).json({err: "Acesso negado"})
    }
    const getToken = (request, response, next) => {
        if(token){
            response.status(401).json({err: "Acesso negado"})
            return
        }
        try{
            const verified = jwt.verify(token, "SENHASUPERSEGURAEDIFICIL")
            request.usuario = verified
            next()
        } catch(error){
            console.error(error)
            response.status(400).json({err: "Token inválido"})
            return
        }
    }
}

export default verifyToken;