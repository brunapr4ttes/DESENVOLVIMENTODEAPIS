const validarUsuario = (request, response, next) => {
    const {nome, email, telefone, senha, confirmsenha} = request.body

    if(!nome){
        response.status(400).json({message: "O nome é obrigatório"})
        return
    }

    if(!email){
        response.status(400).json({message: "O email obrigatório"})
        return
    }

    if(!email.includes("@")){
        response.status(409).json({message: "Deve conter @ do email obrigatório"})
        return
    }

    if(!telefone){
        response.status(400).json({message: "O telfone é obrigatório"})
        return
    }

    if(!senha){
        response.status(400).json({message: "A senha é obrigatória"})
        return
    }

    if(!confirmsenha){
        response.status(400).json({message: "A confirmação da senha é obrigatório"})
        return
    }

    if(senha !== confirmsenha){
        response.status(409).json({message: "Senhas distintas, confirme novamente!"})
    }

    next()
}

export default validarUsuario;