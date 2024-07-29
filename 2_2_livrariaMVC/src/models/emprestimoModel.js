import conn from '../config/conn.js'

const tableEmprestimos = /*sql*/ `
    CREATE TABLE if NOT EXISTS emprestimos(
        emprestimo_id int primary key auto_increment,

        cliente_id varchar(60) not null,
        foreign key (cliente_id) references clientes(cliente_id),

        livro_id varchar(60) not null,
        foreign key (livro_id) references livros(livro_id),
        
        data_emprestimo date not null,
        data_devolucao date not null,

        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp 
    )
`

conn.query(tableEmprestimos, (err, result, field)=>{
    if(err){
        console.error("Erro ao criar a tabela" + err.stack)
        return
    }
    console.log("Tabela [emprestimos] criada com sucesso")
})