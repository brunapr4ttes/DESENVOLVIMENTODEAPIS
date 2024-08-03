import conn from "../config/conn.js";

// 1:N
const tableObjetosImagens = /*sql*/ `
    create table if not exists objetos_images(
         image_id varchar(60) primary key,
         image_path varchar(255) not null,
         objeto_id varchar(255) not null,

         foreign key (objeto_id) references objetos(objeto_id),

         created_at timestamp default current_timestamp,
         updated_at timestamp default current_timestamp on update current_timestamp
    )
`
conn.query(tableObjetosImagens, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Tabela [object_images] criada com sucesso");
  });

export default tableObjetosImagens;
