const res = require('express/lib/response');
const db = require('../database');

function getAll(){
    const sql = `SELECT * FROM events`;

    db.connect( (error) => {
        if (error){
            const response = {
                error: true,
                code: 400,
                message: error.message
            }

            res.send(response);
        } else {
            db.query(sql, (error, result) => {
                if(error){
                    const response = {
                        error: true,
                        code: 400,
                        message: error.message
                    }
                    
                    res.send(response);
                } else {
                    const response = {
                        error: false,
                        code: 400,
                        data: result
                    }
                    
                    res.send(response);
                }
            });
        }
    })    
}

module.exports = {getAll};