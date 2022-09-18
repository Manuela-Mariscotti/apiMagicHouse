function errorHandling(err, req, res, next){

    res.status(500).json({
        error:true,
        code:500,
        message: 'INTERNAL SERVER ERROR HTTP 500 --> ' + err.message
    });

}

module.exports = errorHandling;