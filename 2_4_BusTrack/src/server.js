import 'dotenv/config'
import express from 'express'

// importar models aqui
import './models/linhasModel.js'
import './models/motoristaModel.js'
import './models/onibusModel.js'

// importar as rotas aqui
import linhasRoutes from './routes/linhasRoutes.js'
import motoristaRoutes from './routes/motoristaRoutes.js'
import onibusRoutes from './routes/onibusRoutes.js'

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// colocar as rotas para usar aqui
app.use('/linhas', linhasRoutes)
app.use('/motoristas', motoristaRoutes)
app.use('/onibus', onibusRoutes)


app.listen(PORT, ()=>{
    console.log(`Servidor on PORT: ${PORT}`)
})