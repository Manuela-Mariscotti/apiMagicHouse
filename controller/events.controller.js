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

function postEvent(req, res){
    const title = req.body.title;
    const date = req.body.date;
    const description = req.body.description;
    const created_by = req.body.created_by;

    const sql = `INSERT INTO events (title, date, description, created_by) VALUES (?, ?, ?, ?)`
    const params = [title, date, description, created_by];

    db.query(sql, params, (error, result) => {
        
        console.log(sql)

        if(error){
            
            console.error('ERROR INSERTING EVENT');
            console.error(error);

            const response = {
                error: false,
                code: 400,
                message: error.message
            };
            res.send(response);

        } else {

            const response = {
                error: false,
                code:200,
                data: result
            };
            res.send(response);
        }

    });
}
module.exports = {getAll, postEvent};