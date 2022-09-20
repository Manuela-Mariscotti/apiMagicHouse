const db = require ("../database");

function postUser (req,res){
    console.log("Lanzada postUser");
    console.log(req.body);

    let sql="INSERT INTO users (username,email,password) VALUES ('"+req.body.username+"','"+req.body.email+"','"+req.body.password+"')";
    console.log("Query enviada"+sql);

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

module.exports = {postUser}