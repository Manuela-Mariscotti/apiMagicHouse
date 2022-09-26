const db = require('../database');
const moment = require('moment')

function getBudgetPercent(req, res){
    let now = moment();
    let sql = `
        SELECT sum(value) AS total, budget  FROM gastos 
        JOIN users ON (gastos.id_user = users.id_user)
        JOIN hogares ON (users.id_hogar = hogares.id_hogar)
        WHERE(users.id_hogar = ${req.query.id_hogar} AND date BETWEEN '${moment().startOf('month').format('YYYY-MM-DD')}' AND '${moment().endOf('month').format('YYYY-MM-DD')}')`

        console.log(sql)

    db.query(sql, (error, result) => {
        if(error){
            console.error('ERROR GETTING BUDGET');
            console.error(error);

            const response = {
                error: true,
                code: 400,
                message: error.message
            };

            res.send(response);
        } else {

            let data = {
                spents: result[0].total,
                budget: result[0].budget
            }

            const response = {
                error: false,
                code: 200,
                data: data
            };

            res.send(response);

        }
    });
}

module.exports = {getBudgetPercent}