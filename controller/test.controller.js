const connection = require ("../database")

function test(req, res){
    res.send({messege:'OK'})
}

module.exports = {test}