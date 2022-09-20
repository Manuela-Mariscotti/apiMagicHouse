const e = require('cors')
const db = require('../database')

function login(req, res){
    const sql = `SELECT * FROM users WHERE (username = ? && password = ?)`
    const params = [req.body.username, req.body.password]

    db.connect( (error) => {

        if (error){
            let response = {
                error:true,
                code:400,
                message: 'DB Connection error --> ' + error.message
            }

            res.send(response);
        } else {
            db.query(sql, params, (error, result) => {

                if (error) {

                    let response = {
                        error:true,
                        code:400,
                        message: 'Error executing DB query --> ' + error.message
                    };

                    res.send(response);

                } else {
                    
                    let response = {
                        error:false,
                        code:200,
                        data: result
                    };

                    res.send(response);
                }
            })
        }

    })
}

module.exports = {login};