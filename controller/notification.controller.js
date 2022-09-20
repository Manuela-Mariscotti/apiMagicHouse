const db = require("../database");

function getNextEvent(req, res){
    db.connect( (error) => {
        if(error){
            console.error('ERROR FETCHING NEXT EVENT');
        }else{
            let sql = `SELECT * FROM events ORDER BY date LIMIT 1`
            db.query(sql, (error, result) => {
                if(error){
                    console.error('ERROR EXECUTING NEXTEVENT QUERY')
                }else{
                    const response = {
                        error: false,
                        code:200,
                        data: result
                    }

                    res.send(response);
                }
            });
        }
    })
}

function getPendingTasks(req, res){
    db.connect( (error) => {
        if(error){
            console.error('ERROR FETCHING PENDING TASKS');
        }else{
            let sql = `
            SELECT id_user, tasks.id_task, taskname, day FROM users_tasks
            JOIN tasks ON (users_tasks.id_task = tasks.id_task)
            WHERE (id_user = ${req.query.id_user})`

            db.query(sql, (error, result) => {
                if(error){
                    console.error('ERROR EXECUTING PENDINGTASKS QUERY')
                    console.error(error)
                }else{
                    const response = {
                        error: false,
                        code:200,
                        data: result
                    }

                    res.send(response);
                }
            });
        }
    })
}

module.exports = { getPendingTasks, getNextEvent };
