const db = require('../database');

function getListaCompraByHome(req,res){
    console.log("getListaCompraByHome()")
    console.log(req.query.id_hogar);

    let sql = `SELECT id_product, productname,username FROM lista_compra 
    JOIN users ON (lista_compra.id_user = users.id_user) 
    WHERE id_hogar=${req.query.id_hogar} order by id_product`

    db.connect((error)=>{
        if (error) {
            let response = {
            error : true,
            code : 400,
            message : 'DB Connection error --> '+error.message
        }
        res.send(response);
        }else {
            db.query(sql,(error,result)=>{
                if (error){
                    let response = {
                        error: true,
                        code: 400,
                        message : 'Error executing DB query -->'+error.message
                    }
                    res.send(response)
                } else {
                    let data = [];

                    result.forEach( (item) => {
                        data.push({
                            id_product : item.id_product,
                            productname : item.productname,
                            username : item.username
                        })
                    })
                    console.log(data);

                    let response = {
                        error : false,
                        code : 200,
                        data: data
                    }
                    res.send(response)
                }
            })
        }
    })

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

function deleteByIdProduct(req,res){
    console.log("Lanzada deleteByIdProduct()");
    let sql = `DELETE FROM lista_compra WHERE id_product=${req.query.id_product}`

    db.connect((error)=>{
        if (error) {
            let response = {
                error : true,
                code : 400,
                message : 'DB Connection error --> '+error.message
            }
            res.send(response);
                
        } else {
            db.query(sql,(error,result)=>{
                if (error) {
                    let response = {
                        error: true,
                        code: 400,
                        message : 'Error executing DB query -->'+error.message
                    }
                    res.send(response)

                } else {
                    let response = {
                        error : false,
                        code : 200,
                        data : result
                    }
                    res.send(response)
                    console.log("Eliminación realizada.");
                }
            })
        }
    })
}

module.exports = {getListaCompraByHome,postListaCompra,deleteByIdProduct}