import express from 'express'
import 'dotenv/config'


import conn from './config/conn.js'

import './models/usuarioModel.js'

const PORT = process.env.PORT

//importar as rotas
import userRouter from './routes/userRouter.js'
const app = express()



//Utilizar a rota
app.use('/usuarios', userRouter)

//404
app.use((request, response)=>{
    response.status(404).json({message: 'Recurso não encontrado'})
})
// sempre usar depois de todas as rotas

//404
// app.get('*', (request, response)=>{ // usar o * também serve como rota 404
//     response.send('Olá, Mundo')
// })

app.listen(PORT, ()=>{
    console.log(`Servidor on PORT ${PORT}`)
})