import conn from '../config/conn.js'
import {v4 as uuidv4} from 'uuid'

export const todosOsDados = (request, response) => {
     const query = `
      SELECT 
        onibus.placaOnibus, 
        onibus.modeloOnibus, 
        onibus.anoFabricacao, 
        onibus.capacidade,
        linhas.nomeLinha,
        linhas.numeroLinha,
        linhas.itinerario,
        motoristas.nomeMotorista,
        motoristas.dataNascimento,
        motoristas.numeroHabilitacao
      FROM Onibus AS onibus
      INNER JOIN Linhas AS linhas ON onibus.linha_id = linhas.linha_id
      INNER JOIN Motoristas AS motoristas ON onibus.motorista_id = motoristas.motorista_id
      WHERE onibus.id = ?
    `;
    
    try {
      conn.query(query, [id], (error, resultado) => {
        if (error) {
          console.error("Erro ao consultar os dados dos ônibus:", error);
          return response.status(500).json({ message: "Erro ao tentar solicitar dados!" });
        }
        
        if (resultado.length === 0) {
          return response.status(404).json({ message: "Dados não encontrados para o ID fornecido!" });
        }
  
        const saidaDeDados = resultado.map((item) => ({
          placa: item.placaOnibus,
          modelo: item.modeloOnibus,
          ano_fabricacao: item.anoFabricacao,
          capacidade: item.capacidade,
          linha: {
            nome_linha: item.nomeLinha,
            numero_linha: item.numeroLinha,
            itinerario: item.itinerario,
          },
          motorista: {
            nome: item.nomeMotorista,
            data_nascimento: item.dataNascimento,
            numero_carteira_habilitacao: item.numeroHabilitacao,
          },
        }));
  
        response.status(200).json(saidaDeDados);
      });
    } catch (error) {
      console.error("Erro ao solicitar dados:", error);
      response.status(500).json({ message: "Erro ao solicitar dados abaixo" });
    }
  };

  


export const postOnibus = (request, response)=>{

    const {placaOnibus, modeloOnibus, anoFabricacao, capacidade} = request.body

    if(!placaOnibus){
        response.status(400).json({message: 'a placa é é obrigatória!'})
        return
    }
    if(!modeloOnibus){
        response.status(400).json({message: 'o modelo é obrigatório!'})
        return
    }
    if(!anoFabricacao){
        response.status(400).json({message: 'O ano de fabricação é obrigatório!'})
        return
    }
    if(!capacidade){
        response.status(400).json({message: 'A capacidade é obrigatória!'})
        return
    }

    const checkSql = /*sql*/ `
    select * from onibus
    where ?? = ? and
    ?? = ?
    `

    const checkSqlData = [
        "placaOnibus",
        placaOnibus,
        "modeloOnibus",
        modeloOnibus,
    ]

    conn.query(checkSql, checkSqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar existência de ônibus"})
            return console.error(err)
        }

        if(data.length > 0){
            response.status(409).json({message: "ônibus já cadastrado"})
            return console.log(err)
        }

        const onibus_id = uuidv4()

        const insertSql = /*sql*/ `
        insert into onibus(??, ??, ??, ??,??)
        values(?, ?, ?, ?, ?)
        `

        const insertSqlData = [
            "onibus_id",
            "placaOnibus",
            "modeloOnibus",
            "anoFabricacao",
            "capacidade",
            onibus_id,
            placaOnibus,
            modeloOnibus,
            anoFabricacao,
            capacidade
        ]

        conn.query(insertSql, insertSqlData, (err)=>{
            if(err){
                response.status(500).json({message: "Erro ao cadastrar ônibus"})
                return console.log(err)
            }

            response.status(201).json({message: 'ônibus cadastrado!'})
        })
    })
}

export const getIdOnibus = (request, response)=>{
    const {onibus_id} = request.params
    console.log(onibus_id)
    const sql = /*sql*/ `select * from onibus where onibus_id ="${onibus_id}"`
    console.log(sql)
    const sqlData = [
        "onibus_id",
        onibus_id
    ]

    conn.query(sql, sqlData, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar onibus"})
            return console.log(err)
        }
        console.log(data)
        if(data.length === 0){
            response.status(404).json({message: "onibus não encontrado"})
            return console.log(onibus_id)
        }

        const onibus = data[0]
        response.status(200).json(onibus)
    })
}

export const getOnibus = (request, response)=>{
    const sql = /*sql*/ `
    select * from onibus
    `

    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao verificar onibus existentes"})
            return console.log(err)
        }

        const onibus = data
        response.status(200).json(onibus)
    })
}