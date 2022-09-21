const db = require('../database');

function postSpent(req, res){

    console.log(req.body)

    const sql = `INSERT INTO gastos (title, date, id_user, created_by, value) VALUES (?, ?, ?, ?, ?)`
    const params = [req.body.title, req.body.date, req.body.id_user, req.body.created_by, req.body.value]

    db.connect( (error) => {
        if (error){
                console.error('ERROR CONNECTING DB');
        }else {
            db.query(sql, params, (error, result) => {
                if(error){
                    console.error('ERROR EXECUTING POST SPENT QUERY')

                    const response = {
                        error: true,
                        code: 400,
                        message: error.message
                    }
                    res.send(response);
                }else{
                    const response = {
                        error: false,
                        code: 200,
                        data: result
                    }
                    res.send(response);
                }
            })
        }
    })

}

function getSpentsByHome(req, res){
    db.connect( (error) => {
        if(error){

            const response = {
                error: true,
                code: 400,
                message: 'ERROR CONNECTING DB --> ' + error.message
            }
            console.error(response);
            res.send(response);

        } else {

            const sql = 
            `SELECT id_gasto, title, date, users.id_user, created_by, value FROM gastos 
            JOIN users ON (gastos.id_user = users.id_user)
            WHERE (id_hogar = ${req.query.id_hogar})
            ORDER BY date`

            db.query(sql, (error, result) => {
                
                if(error){

                    const response = {
                        error: true,
                        code: 400,
                        message: 'ERROR EXECUTING QUERY GETHOMESPENTS --> ' + error.message
                    }

                    console.error(response);
                    res.send(response);
                    
                } else {

                    const response = {
                        error: false,
                        code: 200,
                        data: result
                    }
                    
                    res.send(response);
                }
            });

        }
    });
}

function divide(req, res){

    let usuarios = [
        {
            nombre: 'user1',
            cantidadSobrante: 100   
           },{
            nombre: 'user2',
            cantidadSobrante: 100
           },{
            nombre: 'user3',
            cantidadSobrante: 100

           },{
            nombre: 'user4',
            cantidadSobrante: 100   
           },
    ]

    // Calculo de la media: HACER UNA FUNCION
    let sum = usuarios.reduce((previous, current) => {
       return {
                nombre: "total",
                cantidadSobrante: current.cantidadSobrante + previous.cantidadSobrante
            }
    });
    let avg = sum.cantidadSobrante / usuarios.length;
    console.log(avg)


    // Obtener arrays positivos, negativos, ceros. HACER FUNCION
    let positivos = []
    let negativos = []
    let ceros = []

    let transactions = [];    

    usuarios.forEach( (user) => {

        user.saldo = user.cantidadSobrante - avg;
        user.saldo > 0 ? positivos.push(user) : user.saldo < 0 ? negativos.push(user) : ceros.push(user); 


    });

        negativos.forEach( (pagador) => {


            while(positivos.length > 0 && pagador.saldo < 0){

                
                let cobrador = positivos[0];
                
                let cantidadSobrante = pagador.saldo + cobrador.saldo;
                
                let transaction = {
                    pagador: {...pagador},
                    cobrador: {...cobrador},
                    value: -1
                };


                if(cantidadSobrante < 0){

                    transaction.value = pagador.saldo - cantidadSobrante

                    pagador.saldo = cantidadSobrante;
                    positivos.shift();

                }else {

                    transaction.value = pagador.saldo ;
                    cobrador.saldo = cantidadSobrante;
                    pagador.saldo = 0;
                }
                
                transactions.push(transaction)
            }



        });

    const response = {
        error: false,
        code: 200,
        data: transactions
    }
}


module.exports = {postSpent, getSpentsByHome, divide}