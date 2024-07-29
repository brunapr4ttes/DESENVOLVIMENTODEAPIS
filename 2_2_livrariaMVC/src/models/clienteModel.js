import conn from "../config/conn.js"

const tableClientes = /*sql*/`
    CREATE TABLE IF NOT EXISTS clientes(
        id VARCHAR(60) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        imagem VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `
conn.query(tableClientes, (err, result, field) => {
    if (err) {
        console.log(err)
        console.error("Erro ao criar a tabela " + err.stack)
        return
    }
    // console.log(result)
    // console.log(field)
    console.log("Tabela [clientes] criada")
})