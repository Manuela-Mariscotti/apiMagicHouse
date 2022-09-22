const db = require('../database');

function postSpent(req, res){

    console.log(req.body)

    const spent = req.body.spent
    const id_hogar = req.body.id_hogar

    const sql = `INSERT INTO gastos (title, date, id_user, created_by, value) VALUES (?, ?, ?, ?, ?)`
    const params = [spent.title, spent.date, spent.id_user, spent.created_by, spent.value]



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
                    db.query(`UPDATE hogares SET updated_transactions = 0 WHERE (id_hogar = ${id_hogar})`)
                    console.log('transactions_updated = false to hogar: ' + id_hogar)
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
        // {
        //     nombre: 'user1',
        //     cantidad: 100   
        //    },{
        //     nombre: 'user2',
        //     cantidad: 100
        //    },{
        //     nombre: 'user3',
        //     cantidad: 100

        //    },{
        //     nombre: 'user4',
        //     cantidad: 100   
        //    },
    ]

    db.connect( (error) => {
        if(error){

            console.error('ERROR CONNECTING DB')

            const response = {
                error: true,
                code: 400,
                message: error.message
            }

            res.send(response)
        }else {
            const id_hogar = req.query.id_hogar

            const sql = 
                `SELECT gastos.id_user, gastos.id_user, username, sum(value) AS value FROM gastos
                JOIN users ON (gastos.id_user = users.id_user)
                WHERE (id_hogar = ${id_hogar})
                GROUP BY username`;
                
                
                console.log(sql)

            db.query(sql, (error, result) => {

                if(error){
                    console.error('ERROR EXECUTING QUERY DIVIDE');

                    const response = {
                        error: true,
                        code: 400,
                        message: error.message
                    };

                    res.send(response);

                } else{

                    // console.log(result)
                   usuarios = result.map( (item) => {
                    return {
                        id_usuario: item.id_user,
                        nombre: item.username,
                        cantidadAportada: item.value
                    }
                   })

                   const transactions = generateTransactions(usuarios, id_hogar)

                    const response = {
                        error: false,
                        code: 200,
                        data: transactions
                    }

                    res.send(response)

                }
            })
        }
    })
   
}

function updateTransactionsTable(transactions, id_hogar){

    let sql_transaction = `INSERT INTO transactions (id_pagador, nombre_pagador, id_cobrador, nombre_cobrador, value) VALUES`;

    transactions.forEach( (transaction, i) => {
        let transaction_string = `(${transaction.pagador.id_usuario}, '${transaction.pagador.nombre}', ${transaction.cobrador.id_usuario},
             '${transaction.cobrador.nombre}', ${transaction.value})`
        
        if(i > 0){
            sql_transaction += ', '
        }
        sql_transaction += ` ${transaction_string}`
        
        console.log(sql_transaction)
    })


    db.query('TRUNCATE TABLE transactions', (error, result) => {

        if(error){
            console.error('ERROR TRUNCATING TABLE "transactions"');
        }else{
            let sql_flag_updatedTransactions = `UPDATE hogares SET updated_transactions = 1 WHERE (id_hogar = ${id_hogar})`
            
            db.query(sql_transaction, (error, result) => {
                if (error){
                    console.error('ERROR INSERTING TRANSACTION ON TABLE TRANSACTIONS')
                    console.error(error)
        
                }else {
                    console.log('transactions table truncated')
                    
                    db.query(sql_flag_updatedTransactions, (error, result) => {
                      
                        if(error){
                            console.error('ERROR UPDATING KEY "updated_transactions" ON TABLE "hogares"')
                            console.error(error)
                        }else{
                            console.log('transacions table updated')
                        }
        
                    })
                }
            });

        }
    })


}

function generateTransactions(usuarios, id_hogar){
    let sum = usuarios.length > 0 ? usuarios.reduce((previous, current) => {
        return {
            nombre: "total",
            cantidadAportada: current.cantidadAportada + previous.cantidadAportada
        }
    }) : 0;

    let avg = sum.cantidadAportada / usuarios.length;
    // console.log('sum');
    // console.log(sum)
    // console.log('avg')
    // console.log(avg)


    // Obtener arrays positivos, negativos, ceros. HACER FUNCION
    let positivos = []
    let negativos = []
    let ceros = []

    let transactions = [];

    usuarios.forEach((user) => {
        user.saldo = user.cantidadAportada - avg;
        user.saldo > 0 ? positivos.push(user) : user.saldo < 0 ? negativos.push(user) : ceros.push(user);
    });

    negativos.forEach((pagador) => {


        while (positivos.length > 0 && pagador.saldo < 0) {

            let cobrador = positivos[0];

            let cantidadSobrante = pagador.saldo + cobrador.saldo;

            let transaction = {
                pagador: { ...pagador },
                cobrador: { ...cobrador },
                value: -1
            };


            if (cantidadSobrante < 0) {

                transaction.value = pagador.saldo - cantidadSobrante * -1

                pagador.saldo = cantidadSobrante;
                positivos.shift();

            } else {

                transaction.value = pagador.saldo * -1;
                cobrador.saldo = cantidadSobrante;
                pagador.saldo = 0;
            }

            transactions.push(transaction)
        }
        
    });
    //transacciones generadas
    
    updateTransactionsTable(transactions, id_hogar)

    return transactions
}

function isTransactionUpdated(req, res){
    let sql = `SELECT updated_transactions FROM hogares WHERE (id_hogar = ${req.query.id_hogar})`

    db.connect( (error) => {
        if(error){
            console.error('ERROR CONNECTING DB')
            console.error(error)

            const response = {
                error: true,
                code: 400,
                message: error.message
            }
            res.send(response)

        }else{
            db.query(sql, (error, result) => {
                if(error){
                    console.error('ERROR EXECUTING QUERY ISTRANSACTIONSUPDATED')
                    console.error(error)
                    const response = {
                        error: true,
                        code: 400,
                        message: error.message
                    }
                    res.send(response)
                }else{
                    const response = {
                        error: false,
                        code: 200,
                        data: result.pop().updated_transactions != 0
                    }
                    res.send(response)
                }
            });
        }
    });

}

function getTransactionsFromDB(req, res){
    let sql = 
    `SELECT id_pagador, nombre_pagador, id_cobrador, nombre_cobrador, value, id_hogar FROM transactions
    JOIN users ON (id_pagador = users.id_user)
    WHERE(id_hogar = ${req.query.id_hogar})`
   
    db.connect( (error) => {
        if(error){
            console.error('ERROR CONNECTING DB')
            console.error(error)

            const response = {
                error: true,
                code: 400,
                message: error.message
            }
            res.send(response)

        }else{
            db.query(sql, (error, result) => {
                
                if(error){

                    console.error('ERROR EXECUTING QUERY GETTRANSACTIONSFROMDB')
                    console.error(error)
                    const response = {
                        error: true,
                        code: 400,
                        message: error.message
                    }
                    res.send(response)

                }else{

                    let data = [];

                    result.forEach( (transaction) => {
                        data.push({
                            pagador: {id_usuario: transaction.id_pagador, nombre: transaction.nombre_pagador},
                            cobrador:  {id_usuario: transaction.id_cobrador, nombre: transaction.nombre_cobrador},
                            value: transaction.value
                        })
                    })


                    const response = {
                        error: false,
                        code: 200,
                        data: data
                    }
                    res.send(response)

                }
            });
        }
    });
}


module.exports = {postSpent, getSpentsByHome, divide, isTransactionUpdated, getTransactionsFromDB}
