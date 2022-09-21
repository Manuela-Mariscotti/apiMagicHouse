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
                        res.send(String(result.insertId));
                    }else{
                        res.send("-1")
                    }
                }
            })  
        }

    })
}

function putJoinHogar(req,res){
    console.log("Lanzada putJoinHogar()");

    console.log(req.body);

    

}

module.exports = {postNewHogar,putJoinHogar}