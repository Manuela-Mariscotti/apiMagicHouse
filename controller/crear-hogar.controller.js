const db = require('../database');


function postNewHogar(req,res){
    console.log("Lanzada postNewHogar()");
    console.log(req.body);

    let sql = "INSERT INTO hogares (name,type) VALUES ('"+req.body.name+"','"+req.body.type+"')"

    db.connect((error)=>{

        if(error){
            let response = {
                error : true,
                code : 400,
                message : 'DB Connection error --> '+error.message
            }
            res.send(response)
        }else{
            db.query(sql,function(error,result){
                if(error){
                    let response = {
                        error : true,
                        code : 400,
                        message : 'Error executing DB query -->'+error.message
                    };
                    
                    res.send(response)
                    
                }else{

                    if(result.insertId){
                        const response = {
                            error: false,
                            code: 200,
                            data: String(result.insertId)
                        }
                        console.log("Insert realizado.");
                        res.send(response);
                    }else{
                        let response = {
                            error : true,
                            code : 400,
                            message : 'Error creating new house in DB -->'+error.message
                        };

                        res.send(response)
                    }
                }
            })  
        }
    })
}

function putJoinHogar(req,res){
    console.log("Lanzada putJoinHogar()");

    console.log(req.body);

    let sql = "UPDATE users SET id_hogar='"+req.body.id_hogar+"' WHERE id_user='"+req.body.id_user+"'";

    db.connect((error)=>{

        if(error){
            let response = {
                error : true,
                code : 400,
                message : 'DB Connection error --> '+error.message
            }
            res.send(response)
        }else{
            db.query(sql,function(error,result){
                if(error){
                    let response = {
                        error : true,
                        code : 400,
                        data : 'Error executing DB query -->'+error.message
                    };
                    
                    res.send(response)
                    
                }else{
                    let response = {
                        error: false,
                        code: 200,
                        data: String(result.insertId)
                    }
                    console.log("Update realizado");
                    res.send(response);
                }
            })  
        }
    })
}

module.exports = {postNewHogar,putJoinHogar}