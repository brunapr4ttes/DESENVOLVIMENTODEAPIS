const getToken = (request) => { // chamar todas as vezes que for verificar se o token está no cabeçalho
    const authHeader = request.headers.authorization 
    const token = authHeader.split(" ")[1]

    return token
}

export default getToken