import "dotenv/config";
import express from "express"

//conexão com banco de dados
import conn from "./config/conn.js";

//importaçãp dos modilos e criação das tabelas
import "./models/livroModel.js"
import "./models/funcionarioModel.js"
import "./models/clienteModel.js"

//importação das rotas
import livroRoutes from "./routes/livroRoutes.js"
import funcionariosRoutes from "./routes/funcionariosRoutes.js"
import clientesRoutes from "./routes/clientesRoutes.js"

const PORT = process.env.PORT

const app = express()
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Utilização das rotas
//http://localhost:3333/livros
app.use('/clientes', clientesRoutes)

app.get('/', (request, response)=>{
    response.send("Olá, Mundo!")
})

app.listen(PORT, ()=>{
    console.log("Servidor on port " + PORT);
})

