import express from 'express'
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import conn from './config/conn.js'

import './models/usuarioModel.js'
import "./models/objetoModel.js"
import "./models/objetoImagesModel.js"

const PORT = process.env.PORT

//importar as rotas
import userRouter from './routes/userRouter.js'
import objetoRouter from './routes/objetoRouter.js'

const app = express()

//NÃO ESQUEÇA DISSO NUNCA MAIS... OBRIGADO.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//localizar onde está a pasta publica
app.use("/public", express.static(path.join(__dirname, "public")))

//Utilizar a rota
app.use('/usuarios', userRouter)
app.use('/objetos', objetoRouter)

//404
app.use((request, response) => {
    response.status(404).json({ message: 'Recurso não encontrado' })
})
// sempre usar depois de todas as rotas

//404
// app.get('*', (request, response)=>{ // usar o * também serve como rota 404
//     response.send('Olá, Mundo')
// })

app.listen(PORT, () => {
    console.log(`Servidor on PORT ${PORT}`)
})