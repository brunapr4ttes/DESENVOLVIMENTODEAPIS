import conn from '../config/conn.js'

const tableOnibus = /*sql*/ `
    create table if not exists onibus(
        onibus_id varchar(60) primary key not null,
        placaOnibus varchar(255) not null,
        modeloOnibus varchar(255) not null,
        anoFabricacao year not null,
        capacidade int not null,

        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp
    )
`

conn.query(tableOnibus, (err)=>{
    if(err){
        console.log("Erro ao criar a tabela")
        return console.error(err)
    }
    console.log("Tabela [Onibus] criada!")
})