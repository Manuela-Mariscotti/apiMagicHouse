const db = require('../database');
const moment = require('moment');

function getAll(req, res){
    const sql = 
    `SELECT * FROM events
    JOIN users ON (created_by = id_user) 
    WHERE (id_hogar = ${req.query.id_hogar})`;

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

                    let data = result.map( (item) =>{
                        let date = moment(item.date)
                        
                        return {
                            title: item.title,
                            description: item.description,
                            created_by: item.created_by,
                            date: date.format('YYYY-MM-DD')
                        }
                    })

                    const response = {
                        error: false,
                        code: 400,
                        data: data
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
function deleteEvent(req, res){
    const title = req.body.title;
    const created_by = req.body.created_by;

    const sql = `DELETE FROM events WHERE (title = '${title}' && created_by = ${created_by})`

    console.log(sql);

    db.query(sql, (error, result) => {

        if(error){
            
            console.error('ERROR DELETING EVENT');
            console.error(error);

            const response = {
                error: true,
                code: 400,
                message:error.message
            };
            res.send(response);

        } else {

            const response = {
                error: false,
                code: 200,
                data:result
            };
            res.send(response);
        }
    })
}
module.exports = {getAll, postEvent, deleteEvent};