import conn from '../config/conn.js'

const tableMotorista = /*sql*/ `
    create table if not exists motoristas(
        motorista_id varchar(60) primary key not null,
        nome varchar(255) not null,
        dataNascimento date not null,
        numeroCarteiraHabilitacao varchar(255) not null,

        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp
    )
`

conn.query(tableMotorista, (err)=>{
    if(err){
        console.log("Erro ao criar a tabela")
        return console.error(err)
    }
    console.log("Tabela [Motoristas] criada!")
})