import "dotenv/config"
import mysql from 'mysql2'

const conn = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "Sen@iDev77!.",
    database: "funcionariosMVC",
    port: 3306,
})

conn.connect((err)=>{
    if(err){
        return console.error(err.stack)
    }
    console.log('MySQL Conectado')
})

export default conn;