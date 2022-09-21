const db = require('../database');

function getUsersByHome(req, res){
    db.connect( (error) => {

        if(error){

            const response = {
                error: true,
                code: 400,
                message: 'ERROR CONNECTING DB --> ' + error.message
            }
            console.error(response.message);
            res.send(response);

        }else {

            const sql = `SELECT username, id_user FROM users WHERE (id_hogar = ${req.query.id_hogar})`

            db.query(sql, (error, result) => {

                if (error){
                    const response = {
                        error: true,
                        code: 400,
                        message: 'ERROR EXECUTING QUERY GETUSERSBYHOME --> ' + error.message
                    }
                    console.error(response.message);
                    res.send(response);

                }else {
                    let data = []
                    
                    result.forEach( (item) => {
                        data.push({
                            id_user: item.id_user,
                            username:item.username,
                        });
                    })

                    console.log(data)  

                    const response = {
                        error: false,
                        code: 200,
                        data: data
                    }
                    res.send(response);
                
                }

            });
        }
    });
}

function getUserByid(req, res){
    db.connect( (error) => {

        if(error){

            const response = {
                error: true,
                code: 400,
                message: 'ERROR CONNECTING DB --> ' + error.message
            }
            console.error(response.message);
            res.send(response);

        }else {

            const sql = `SELECT * FROM users WHERE (id_user = ${req.query.id_user})`

            db.query(sql, (error, result) => {

                if (error){
                    const response = {
                        error: true,
                        code: 400,
                        message: 'ERROR EXECUTING QUERY GETUSERBYID --> ' + error.message
                    }
                    console.error(response.message);
                    res.send(response);

                }else {

                    const response = {
                        error: false,
                        code: 200,
                        data: result ,
                    }
                    res.send(response);
                
                }

            });
        }
    });
}

module.exports = {getUsersByHome, getUserByid}