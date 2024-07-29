import 'dotenv/config'
import express from "express"
import mysql from 'mysql2'
import {v4 as uuidv4} from 'uuid'

const PORT = process.env.PORT

const app = express()

app.use(express.json())

//Criar conexão com o banco de dados MySQL

// const conn = mysql.createConnection({ // usado para estebelecar conexões
//     host: "localhost",
//     user: "root",
//     password: 'Sen@iDev77!.',
//     database: 'livraria_js',
//     port: '3306'
// })

const conn = mysql.createConnection({ // usado para estebelecar conexões
    host: "localhost",
    user: "root",
    password: 'Sen@iDev77!.',
    database: 'empresa_js',
    port: '3306'
})

// conectar ao banco de dados

conn.connect((err)=>{
    if(err){
        console.error(err.stack) // para dizer qual foi exatamente o erro que aconteceu
    }
    console.log("MySQL conectado")
})

app.get("/livros", (request, response)=>{

    // QUERY para o banco de dados - jeito bonito de falar "consulta"
    const  sql = /*sql*/ `SELECT * FROM livros` // cria uma coisa aqui para poder passar essa instrução do SQL depois
    // agora preciso estabelecer a conexão com o banco de dados para fazer a query (consulta)
    conn.query(sql, (err, data)=>{ // query recebe 2 parâmetros - 1º a variável (da consulta em si) //// 2º função callback
        if(err){
            response.status(500).json({message: 'Erro ao buscar os livros'})
            return console.log(err)
        }
        const livros = data // desestruturação
        console.log(data) // ver o que ta vindo do banco de dados
        console.log(typeof data) // ver o tipo de dado que está vindo (string, boolean, numérico e afins)
        response.status(200).json(livros)
    }) 
})

app.post("/livros", (request, response)=>{
    const {titulo, autor, ano_publicacao, genero, preco} = request.body // tá recebendo as requisições

    // validação
    // vai ser um if para cada umas das informações, para garantir que não venham vazios
    if(!titulo){
        response.status(400).json({message: 'O título é obrigatório!'})
        return
    }
    if(!autor){
        response.status(400).json({message: 'O autor é obrigatório!'})
        return
    }
    if(!ano_publicacao){
        response.status(400).json({message: 'O ano de publicação é obrigatório!'})
        return
    }
    if(!genero){
        response.status(400).json({message: 'O genero é obrigatório!'})
        return
    }
    if(!preco){
        response.status(400).json({message: 'O preco é obrigatório!'})
        return
    }

    // cadastrar um livro -> antes preciso saber se esse livro existe
    const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE titulo = "${titulo}" AND 
    autor = "${autor}" AND 
    ano_publicacao = "${ano_publicacao}"
    `;

    conn.query(checkSql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar os livros"})
            return console.log(err)
        }
        if(data.length > 0){ // se for maior que 0 significa que já existe um livro com essas informações
            response.status(409).json({message: 'Livro já cadastrado na base de dados'}) // 409 - deu certo mas não esparava esses dados
            return console.log(err)
        }

        const id = uuidv4() // passando o id aleatório através do uuid
        const disponibilidade = 1 // aqui coloca 1 pq o banco de dados lá vai interpretar que está disponivel, e se estamos cadastrando é pq iremos ter o livro disponível

        // agora vamos cadastrar as informações
        const insertSql = /*sql*/ `insert into livros(id, titulo, autor, ano_publicacao, genero, preco, disponibilidade) 
        values("${id}","${titulo}","${autor}","${ano_publicacao}","${genero}","${preco}","${disponibilidade}");`

        conn.query(insertSql, (err)=>{
            if(err){
                response.status(500).json({message: 'Erro ao cadastrar o livro'})
                return console.log(err)
            }
            response.status(201).json({message: 'Livro cadastrado'})
        })
    })
})

//Listar um Livro
app.get('/livros/:id', (request, response)=>{
    const {id} = request.params // pega o id que for passado na rota

    const sql = /*sql*/`SELECT * FROM livros WHERE id = "${id}"` 
    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message:"Erro ao buscar livro"})
            return
        }
        if(data.length === 0){ //0 pois é necessário que a consulta retorne alguma coisa
            response.status(404).json({message: "Livro não encontrado"})
            return
        }
        response.status(200).json(data)
    })
})

app.put('/livros/:id', (request, response)=>{
    const {id} = request.params // pega o id que for passado na rota

    const {titulo, autor, ano_publicacao, genero, preco, disponibilidade} = request.body;

    //validações
    if(!titulo){
        response.status(400).json({message: 'O título é obrigatório!'});
        return
    }
    if(!autor){
        response.status(400).json({message: 'O autor é obrigatório!'});
        return
    }
    if(!ano_publicacao){
        response.status(400).json({message: 'O ano de publicação é obrigatório!'});
        return
    }
    if(!genero){
        response.status(400).json({message: 'O gênero é obrigatório!'});
        return
    }
    if(!preco){
        response.status(400).json({message: 'O preço é obrigatório!'});
        return
    }
    if(disponibilidade == undefined){
        response.status(400).json({message: 'A disponibilidade é obrigatória!'});
        return
    }

    const checkSql = /*sql*/`SELECT * FROM livros WHERE id = "${id}"`
    conn.query(checkSql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao buscar livros"})
            return
        }
        if(data.length === 0){
            return response.status(404).json({message: "Livro não encontrado"})
        }

        //consulta SQL para atulaizar livro
        const updateSql = /*sql*/`UPDATE livros SET titulo = "${titulo}", autor = "${autor}", ano_publicacao = "${ano_publicacao}", genero = "${genero}", preco = "${preco}", disponibilidade = "${disponibilidade}" WHERE id = "${id}"`
        conn.query(updateSql, (err)=>{
            if(err){
                console.error(err)
                response.status(500).json({message: "Erro ao atualizar livro"})
                return
            }
            response.status(200).json({message:"Livro atualizado"})
        })
    })
})


app.delete('/livros/:id', (request, response)=>{
    const {id} = request.params // pega o id que for passado na rota

    const deleteSql = /*sql*/ `DELETE FROM livros WHERE id = "${id}"`
    conn.query(deleteSql, (err, info)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao deletar livro"})
            return  
        }

        if(info.affectedRows === 0){
            response.status(404).json({message: "Livro não encontrado"})
            return
        }

        response.status(200).json({message: "Livro Selecionado foi deletado"})
    })
})

/********************* Rotas de Funcionários ************************* */
/* id, nome, cargo, data_contratacao, salario, email, created_at, updated_at */

//ROTA 1 -> lista todos ✅
//ROTA 2 -> cadastra funcionario ✅
//ROTA 3 -> lista 1 funcionário (único email por funcionário) ✅
//ROTA 4 -> atualizar 1 funcionário ✅
//ROTA 5 -> deletar um funcionário ✅

// app.get("/funcionarios", (request, response)=>{
//     const sql = /*sql*/ `SELECT * FROM funcionarios`
//     conn.query(sql, (err, data)=>{
//         if(err){
//             response.status(500).json({message: 'Erro ao buscar os funcionarios'})
//             return console.log(err)
//         }
//         const funcionarios = data
//         console.log(data)
//         console.log(typeof data)
//         response.status(200).json(funcionarios)
//     })
// });

// app.post("/funcionarios", (request, response)=>{

// const {nome, cargo, data_contratacao, salario, email} = request.body

//     if(!nome){
//         response.status(400).json({message: 'O nome é obrigatório!'})
//         return
//     }
//     if(!cargo){
//         response.status(400).json({message: 'O cargo é obrigatório!'})
//         return
//     }
//     if(!data_contratacao){
//         response.status(400).json({message: 'A data de contratação é obrigatória!'})
//         return
//     }
//     if(!salario){
//         response.status(400).json({message: 'O salário é obrigatório!'})
//         return
//     }
//     if(!email){
//         response.status(400).json({message: 'O email é obrigatório!'})
//         return
//     }

//     const checkSql = /*sql*/ `
//     SELECT * FROM funcionarios 
//     WHERE email = "${email}" 
//     `;

//     conn.query(checkSql, (err, data)=>{
//         if(err){
//             response.status(500).json({message: "Erro ao buscar os funcionarios"})
//             return console.log(err)
//         }
//         if(data.length > 0){ 
//             response.status(409).json({message: 'Funcionario já cadastrado na base de dados'}) 
//             return console.log(err)
//         }

//         const id = uuidv4() 
//         const insertSql = /*sql*/ `insert into funcionarios(id, nome, cargo, data_contratacao, salario, email) 
//         values("${id}","${nome}","${cargo}","${data_contratacao}","${salario}","${email}");`

//         conn.query(insertSql, (err)=>{
//             if(err){
//                 response.status(500).json({message: 'Erro ao cadastrar o funcionario'})
//                 return console.log(err)
//             }
//             response.status(201).json({message: 'Funcionario cadastrado'})
//         })
//     })
// });

// app.get('/funcionarios/:id', (request, response)=>{
//     const {id} = request.params

//     const sql = /*sql*/`SELECT * FROM funcionarios WHERE id = "${id}"` 
//     conn.query(sql, (err, data)=>{
//         if(err){
//             console.error(err)
//             response.status(500).json({message:"Erro ao buscar funcionário"})
//             return
//         }
//         if(data.length === 0){
//             response.status(404).json({message: "Funcionário não encontrado"})
//             return
//         }
//         response.status(200).json(data)
//     })
// })

// app.put('/funcionarios/:id', (request, response)=>{
//     const {id} = request.params

//     const {nome, cargo, data_contratacao, salario, email} = request.body;

//     if(!nome){
//         response.status(400).json({message: 'O nome é obrigatório!'});
//         return
//     }
//     if(!cargo){
//         response.status(400).json({message: 'O cargo é obrigatório!'});
//         return
//     }
//     if(!data_contratacao){
//         response.status(400).json({message: 'A data de contratação é obrigatória!'});
//         return
//     }
//     if(!salario){
//         response.status(400).json({message: 'O salario é obrigatório!'});
//         return
//     }
//     if(!email){
//         response.status(400).json({message: 'O email é obrigatório!'});
//         return
//     }

// const checkSql = /*sql*/ `SELECT * FROM funcionarios WHERE id = "${id}"`

//     conn.query(checkSql, (err, data)=>{
//         if(err){
//             console.error(err)
//             response.status(500).json({message: "Erro ao buscar funcionarios"})
//             return
//         }
//         if(data.length === 0){
//             return response.status(404).json({message: "Funcionario não encontrado"})
//         }

//     const checkSqlEmail = /*sql*/`SELECT * FROM funcionarios WHERE email = "${email}"`

// conn.query(checkSqlEmail, (err, data)=>{
//     if(err){
//         console.log(err)
//         response.status(500).json({message: "Erro ao verificar se email já está cadastrado"})
//         return
//     }
//     if(data.length >0){
//         console.log(err)
//         response.status(409).json({message: "Funcionário existente já possui esse email"})
//         return
//     }
// })
//         const updateSql = /*sql*/`UPDATE funcionarios SET nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}", salario = "${salario}", email = "${email}" WHERE id = "${id}"`
//         conn.query(updateSql, (err)=>{
//             if(err){
//                 console.error(err)
//                 response.status(500).json({message: "Erro ao atualizar funcionário"})
//                 return
//             }
//             response.status(200).json({message:"Funcionário atualizado"})
//         })
//     })
// })

// app.delete('/funcionarios/:id', (request, response)=>{
//     const {id} = request.params

//     const deleteSql = /*sql*/ `DELETE FROM funcionarios WHERE id = "${id}"`
//     conn.query(deleteSql, (err, info)=>{
//         if(err){
//             console.error(err)
//             response.status(500).json({message: "Erro ao deletar funcionário"})
//             return  
//         }

//         if(info.affectedRows === 0){
//             response.status(404).json({message: "Funcionário não encontrado"})
//             return
//         }

//         response.status(200).json({message: "Funcionário selecionado foi deletado"})
//     })
// })

//RESOLUÇÃO DO CARLOS WILTON
app.get("/funcionarios", (request, response)=>{
    const sql = /*sql*/ `SELECT * FROM funcionarios`
    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message: 'Erro ao buscar os funcionarios'})
            return console.log(err)
        }
        const funcionarios = data
        console.log(data)
        console.log(typeof data)
        response.status(200).json(funcionarios)
    })
});

app.post("/funcionarios", (request, response)=>{

const {nome, cargo, data_contratacao, salario, email} = request.body

    if(!nome){
        response.status(400).json({message: 'O nome é obrigatório!'})
        return
    }
    if(!cargo){
        response.status(400).json({message: 'O cargo é obrigatório!'})
        return
    }
    if(!data_contratacao){
        response.status(400).json({message: 'A data de contratação é obrigatória!'})
        return
    }
    if(!salario){
        response.status(400).json({message: 'O salário é obrigatório!'})
        return
    }
    if(!email.includes("@")){
        response.status(422).json({message: 'O email é obrigatório!'})
        return
    }

    const checkSql = /*sql*/ `
    SELECT * FROM funcionarios 
    WHERE email = "${email}" 
    `;

    conn.query(checkSql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar os funcionarios"})
            return console.log(err)
        }
        if(data.length > 0){ 
            response.status(409).json({message: 'o Email já existe!'}) 
            return console.log(err)
        }

        const id = uuidv4() 
        const insertSql = /*sql*/ `insert into funcionarios(id, nome, cargo, data_contratacao, salario, email) 
        values("${id}","${nome}","${cargo}","${data_contratacao}","${salario}","${email}");`

        conn.query(insertSql, (err)=>{
            if(err){
                console.log(err)
                response.status(500).json({message: 'Erro ao cadastrar o funcionario'})
                return
            }
            response.status(201).json({message: 'Funcionario cadastrado'})
        })
    })
});

app.get('/funcionarios/:id', (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/`SELECT * FROM funcionarios WHERE id = "${id}"` 
    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message:"Erro ao buscar funcionário"})
            return
        }
        if(data.length === 0){
            response.status(404).json({message: "Funcionário não encontrado"})
            return
        }
        response.status(200).json(data)
    })
})

app.put('/funcionarios/:id', (request, response)=>{
    const {id} = request.params

    const {nome, cargo, data_contratacao, salario, email} = request.body;

    if(!nome){
        response.status(400).json({message: 'O nome é obrigatório!'});
        return
    }
    if(!cargo){
        response.status(400).json({message: 'O cargo é obrigatório!'});
        return
    }
    if(!data_contratacao){
        response.status(400).json({message: 'A data de contratação é obrigatória!'});
        return
    }
    if(!salario){
        response.status(400).json({message: 'O salario é obrigatório!'});
        return
    }
    if(!email.includes("@")){
        response.status(422).json({message: 'O email é obrigatório!'})
        return
    }

const checkSql = /*sql*/ `SELECT * FROM funcionarios WHERE id = "${id}"`

    conn.query(checkSql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao buscar funcionarios"})
            return
        }
        if(data.length === 0){
            return response.status(404).json({message: "Funcionario não encontrado"})
        }

    const checkSqlEmail = /*sql*/`SELECT * FROM funcionarios WHERE email = "${email}" AND id != ${id}`

conn.query(checkSqlEmail, (err, data)=>{
    if(err){
        console.log(err)
        response.status(500).json({message: "Erro ao verificar se email já está cadastrado"})
        return
    }
    if(data.length >0){
        console.log(err)
        response.status(409).json({message: "Funcionário existente já possui esse email"})
        return
    }
})
        const updateSql = /*sql*/`UPDATE funcionarios SET nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}", salario = "${salario}", email = "${email}" WHERE id = "${id}"`
        conn.query(updateSql, (err)=>{
            if(err){
                console.error(err)
                response.status(500).json({message: "Erro ao atualizar funcionário"})
                return
            }
            response.status(200).json({message:"Funcionário atualizado"})
        })
    })
})

app.delete('/funcionarios/:id', (request, response)=>{
    const {id} = request.params

    const deleteSql = /*sql*/ `DELETE FROM funcionarios WHERE id = "${id}"`
    conn.query(deleteSql, (err, info)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao deletar funcionário"})
            return  
        }

        if(info.affectedRows === 0){
            response.status(404).json({message: "Funcionário não encontrado"})
            return
        }

        response.status(204).json({message: "Funcionário selecionado foi deletado"})
    })
})

//rota 404
app.use((request, response)=>{
    response.status(404).json({message: "Rota não encontrada"})
})

process.on('SIGINT'), ()=>{
    conn.end((err)=>{
        if(err){
            console.error(`Erro ao fechar a conexão ${err.message}`);
        }
        console.log("Conexão com MYSQL encerrada.");
        process.exit();
    })
}

app.listen(PORT, ()=>{
    console.log(`Servidor on PORT ${PORT}`)
})