const db = require('../database');

function getListaCompraByHome(req,res){
    console.log("getListaCompraByHome()")
    console.log(req.query);

    let sql = "SELECT * FROM `magic-house`.lista-compra WHERE id_hogar="+req.query

}

function postListaCompra(req,res){
    console.log("postListaCompra()");
    console.log(req.body);

    let sql = "INSERT INTO lista_compra (productname,id_user) VALUES ('"+req.body.productname+"', '"+req.body.id_user+"')";

    db.connect((error)=>{
        
        if(error){
            let response = {
                error : true,
                code : 400,
                data : 'DB Connection error --> '+error.message
            }
            res.send(response);

        } else {
            db.query(sql , (error,result)=>{
                
                if (error) {
                    let response = {
                        error : true,
                        code : 400,
                        data : 'Error executing DB query --> '+error.message
                    }                    
                    res.send(response);

                } else {
                    if (result.insertId){
                        let response = {
                            error : false,
                            code : 200, 
                            data : String(result.insertId)
                        }
                        console.log("Insert realizado.");
                        res.send(response);
                    } else {
                        let response = {
                            error : true,
                            code : 400,
                            message : 'Error creating new item in DB --> '+error.message
                        }
                        res.send(response)
                    }
                }
            })
        }
    })
}

module.exports = {getListaCompraByHome,postListaCompra}