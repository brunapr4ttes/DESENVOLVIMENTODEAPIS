import { request } from 'express';
import conn from '../config/conn.js';
import { v4 as uuidv4 } from 'uuid';

export const getLivros = (request, response) => {
    const sql =  /*sql*/ `SELECT * FROM livros`;
    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar livros"});
            return;
        }
        const livros = data 
        response.status(200).json(livros);
    });
};

export const cadastrarLivros = (request, response) => {
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
};

export const buscarLivros = (request, response) => {
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
}

export const editarLivros = (request, response) => {
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
}

export const deletarLivros = (request, response) => {
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
}