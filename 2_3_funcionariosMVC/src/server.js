import "dotenv/config"
import express from 'express'

//conexão com banco de dados
import conn from './config/conn.js'

//importacao dos modulos e criacao das tabelas
import './models/funcionarioModel.js'

import funcionarioRoutes from '../src/routes/funcionarioRoutes.js'

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/funcionarios', funcionarioRoutes) // rota só vai ser acessada se for através desse endpoint

app.get('/', (request, response)=>{
    response.send('Olá, Mundo!')
})

app.listen(PORT, ()=>{
    console.log(`Servidor on PORT: ${PORT}`)
})