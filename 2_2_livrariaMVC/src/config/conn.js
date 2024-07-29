import "dotenv/config"
import mysql from "mysql2";

const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, //Sen@iDev77!.
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
})

conn.connect((err)=>{
    if(err){
        return console.error(err.stack);
    }
    console.log("MySQL Conectado")

})

export default conn