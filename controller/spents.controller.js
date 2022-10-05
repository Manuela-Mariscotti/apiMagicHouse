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

    let usuarios = [];
    let transacions_db;

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
                    db.query(
                        `SELECT id_pagador, nombre_pagador, id_cobrador, value, nombre_cobrador, id_hogar, done
                        FROM transactions JOIN users ON (id_pagador = id_user)
                        WHERE (id_hogar = ${id_hogar})`
                        ,(error, result_transactionsDB) => {
                
                            if(error){
                
                                console.error('ERROR EXECTING QUERY');
                                console.error(error);
                
                            } else {
                
                                transacions_db = result_transactionsDB;

                                usuarios = result.map( (item) => {
                                    return {
                                        id_usuario: item.id_user,
                                        nombre: item.username,
                                        cantidadAportada: item.value
                                    }
                                });
                            
                                const transactions = generateTransactions(usuarios, id_hogar, transacions_db);

                                let data = transactions.filter( (item) =>  !item.isDone);
                                console.log(data)
                            
                                const response = {
                                     error: false,
                                     code: 200,
                                     data: transactions
                                };

                                res.send(response);
                            
                            }
                        })//query end
        


                }
            })
        }
    })
   
}

function updateTransactionsTable(transactions, id_hogar){
    
    let sql_transaction = ``;

    transactions.forEach( (transaction, i) => {

        if(i==0){
            sql_transaction = `INSERT INTO transactions (id_pagador, nombre_pagador, id_cobrador, nombre_cobrador, value) VALUES`;
        }
        
        let transaction_string = `(${transaction.pagador.id_usuario}, '${transaction.pagador.nombre}', ${transaction.cobrador.id_usuario},
             '${transaction.cobrador.nombre}', ${transaction.value})`
        
        if(i > 0){
            sql_transaction += ', '
        }

        sql_transaction += ` ${transaction_string}`
        
    })
    console.log(sql_transaction)


    db.query(`DELETE transactions FROM transactions JOIN users ON (id_pagador = id_user) WHERE (id_hogar = ${id_hogar} && done = false)`, (error, result) => {

        if(error){
            console.error('ERROR UPDATING TABLE "transactions"');
            console.error(error)
        }else{
            let sql_flag_updatedTransactions = `UPDATE hogares SET updated_transactions = 1 WHERE (id_hogar = ${id_hogar})`
            
            if(sql_transaction.length > 0){

                db.query(sql_transaction, (error, result) => {
                    if (error){
                        console.error('ERROR INSERTING TRANSACTION ON TABLE TRANSACTIONS')
                        console.error(error)
            
                    }else {
                        
                        db.query(sql_flag_updatedTransactions, (error, result) => {
                            
                            console.log('transacions table updated')
                          
                            if(error){
                                console.error('ERROR UPDATING KEY "updated_transactions" ON TABLE "hogares"')
                                console.error(error)
                            }else{
                                console.log('hogares marked as unupdated')

                            }
            
                        })
                    }
                });

            }

        }
    })


}

 function generateTransactions(usuarios, id_hogar, transactions_db){
    let sum = usuarios.length > 0 ? usuarios.reduce((previous, current) => {
        return {
            nombre: "total",
            cantidadAportada: current.cantidadAportada + previous.cantidadAportada
        }
    }) : 0;

    let avg = ( sum.cantidadAportada / usuarios.length ).toFixed(0);
    console.log('Generando transacciones');
    console.log('avg --> ' + avg)
    // console.log('avg')
    // console.log(avg)


    // Obtener arrays positivos, negativos, ceros. HACER FUNCION
    let positivos = []
    let negativos = []
    let ceros = []

    let transactions = [];
    let transactions_filteredDones = []

    let transactionsDB = transactions_db;

    usuarios.forEach((user) => {
        user.saldo = user.cantidadAportada - avg;
        user.saldo > 0 ? positivos.push(user) : user.saldo < 0 ? negativos.push(user) : ceros.push(user);
        console.log('USUARIO --> ' + user)

    });


    
    negativos.forEach((pagador) => {
        
            while (positivos.length > 0 && pagador.saldo < 0) {
            
                let cobrador = positivos[0];
            
                let cantidadSobrante = pagador.saldo + cobrador.saldo;
            
                let transaction = {
                    pagador: { ...pagador },
                    cobrador: { ...cobrador },
                    value: -1,
                    isDone: false
                };
                
                
                if (cantidadSobrante < 0) {
                
                    transaction.value = Number( ( (pagador.saldo - cantidadSobrante) * -1).toFixed(2) );
                
                    pagador.saldo = cantidadSobrante;
                    positivos.shift();
                
                } else {
                
                    transaction.value = Number((pagador.saldo * -1).toFixed(2));
                    cobrador.saldo = cantidadSobrante;
                    pagador.saldo = 0;
                }

                transactions.push(transaction) 
            }
            
        });

        
        transactions.forEach( (element, index) => {

            let x = transactionsDB.findIndex( (item) => {
                return element.pagador.id_usuario == item.id_pagador && element.cobrador.id_usuario == item.id_cobrador &&
                    element.value == item.value && item.done != 0
            }) 
            
            console.log(x)

            if(x == -1) transactions_filteredDones.push(element)

        })

        updateTransactionsTable(transactions_filteredDones, id_hogar)
        return transactions_filteredDones
        
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
    `SELECT id_pagador, nombre_pagador, id_cobrador, nombre_cobrador, value, done, id_hogar FROM transactions
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

                        if(transaction.done == 0){

                            data.push({
                                pagador: {id_usuario: transaction.id_pagador, nombre: transaction.nombre_pagador},
                                cobrador:  {id_usuario: transaction.id_cobrador, nombre: transaction.nombre_cobrador},
                                value: transaction.value,
                                isDone: false
                            });
                        }
                    });


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

function doTransaction (req, res){
    console.log(req.body)

    let sql = 
        `UPDATE transactions SET done = 1
        WHERE (id_pagador = ${req.body.pagador.id_usuario} && id_cobrador = ${req.body.cobrador.id_usuario} && value = ${req.body.value})`
        
        db.query(sql, (error, result) => {

            if (error){

                console.error('ERROR MARKING TRANSACTION AS DONE')
                console.error(error);

                const response = {
                    error: true,
                    code: 400,
                    message: error.message
                }
                res.send(response);

            } else {

                console.log('transaction marked as DONE');

                const sql = `UPDATE hogares SET updated_transactions = 0 WHERE (id_hogar = ${req.body.id_hogar})`
                console.log(sql);

                db.query(sql, (error, result) => {
                    if(error){
                        console.error('ERROR UPDATING KEY "updated_transactions" ON TABLE "hogares"')
                        console.error(error)

                        const response = {
                            error: true,
                            code: 400,
                            message: error.message
                        }
                        res.send(response);
                    }else{

                        console.log('hogares marked as unupdated')

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


module.exports = {postSpent, getSpentsByHome, divide, isTransactionUpdated, getTransactionsFromDB, doTransaction}
