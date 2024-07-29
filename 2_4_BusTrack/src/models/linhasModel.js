import conn from '../config/conn.js'

const tableLinhas = /*sql*/ `
    create table if not exists linhas(
        linha_id varchar(60) primary key not null,
        nomeLinha varchar(255) not null,
        numeroLinha int not null,
        itinerario varchar(255) not null,

        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp
    )
`

conn.query(tableLinhas, (err)=>{
    if(err){
        console.log("Erro ao criar a tabela")
        return console.error(err)
    }
    console.log("Tabela [Linhas] criada!")
})