import express from 'express' // importando
// igual a -> import express from 'express'

import {v4 as uuidv4} from "uuid"

const PORT = 3333

const app = express() // pegando tudo o que o express tem

// Aceitar JSON
app.use(express.json()) // isso aqui vai fazer eu conseguir receber os dados lá do body do post

//Rotas
/* 
    Request HTTP
    -> query params - ...:3333/pessoas?nome="Ronaldo"&idade=17
    quando vai colocar parâmetros e assim colocar valores para eles
            Rotas do tipo GET - usado para filtrar e buscar
    
    -> route params - ...3333/pessoas/5
    quando passa valores após a rota lá
            Rotas do tipo GET, PUT, PATH, DELETE - listar um elemento


    -> body params - ...3333/pessoas
    valores que recebe pelo corpo
            Rotas do tipo POST - usadadas em cadastro de informações
*/

// Middleware
const logRoutes = (request, response, next) =>{
    const {url, method} = request
    const rota = `[${method.toUpperCase()}] ${url}`
    console.log(rota)
    next()
}

app.use(logRoutes) // vai fazer o middleware ser usado em todas as rotas sem precisar ficar colocando ele em cada uma delas


const users = []
// QUERY PARAMS - usado nessa rota get aqui
// vamos colocar as rotas que vem do express, usando a constante app
app.get('/users', (request, response)=>{  // se eu quero a rota get tenho que passar a rota e a função de callback com requisição e resposta
    // const query = request.query
    const {nome, idade} = request.query
    console.log(nome, idade)

    response.status(200).json(users) // igual o que a gente fazia pra fazer aparecer uma mensagem de acordo com o código HTTP
}) 


// BODY PARAMS
app.post('/users', (request, response)=>{  // aqui a mesma coisa, mas com a rota POST, funciona com todos os métodos HTTP =)
    // const body = request.body
    // console.log(body)
    const {nome, idade} = request.body
    console.log(nome, idade)

    //validações
    if(!nome){
        response.status(400).json({message: "O nome é obrigatório"})
        return
    }

    if(!idade){
        response.status(400).json({message: "A idade é obrigatória"})
        return
    }

    // para passar as informações para o banco de dados
    const user = {
        id: uuidv4(),
        nome,
        idade
    }

    users.push(user)
    response.status(201).json({
        message:"Usuário cadastrado",
        user
})

    response.status(201).json([
        'Pessoa 1',
        'Pessoa 2',
        'Pessoa 3',
        'Pessoa 4'
    ])
}) 


// ROUTE PARAMS - usar nessa rota de PUT
app.put('/users/:id', (request, response)=>{ // colocando a rota dessa forma estaremos substituindo todo o trabalho de usar o split para pegar o id e afins
    // const id = request.params.id
    // const cpf = request.params.cpf

    const {id} = request.params
    const {nome, idade} = request.body

    const indexUser = users.findIndex((user)=> user.id == id)
    if(indexUser === -1){
        response.status(404).json({message: "Usuário não encontrado"})
        return
    }

    if(!nome  || !idade){
        response.status(400).json({message:"Nome e idade é obrigatório"})
        return
    }

    const updatedUser = {
        id, 
        nome, 
        idade
    }

    users[indexUser] = updatedUser
    response.status(200).json(updatedUser)

})

app.patch('/users', (request, response)=>{ 
    response.status(200).json({msg: 'PATCH'})
}) 

app.delete('/users', (request, response)=>{  
    const id = request.params.id
    const indexUser =users.findIndex((user)=> user.id == id)

    if(indexUser === -1){
        response.status(404).json({message: "Usuário não encontrado"})
        return
    }

    users.splice(indexUser, 1)
    response.status(204).send("apagado")
}) 

app.listen(PORT, ()=>{
    console.log(`Servidor on PORT ${PORT}`)
})