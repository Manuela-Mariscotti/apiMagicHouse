const express = require('express');
const cors = require('cors');

const errorHandling = require('./error/errorHandling');

const testRouter = require('./router/test.router');
const loginRouter = require('./router/login.router');

const app = express();

app.set('PORT', process.env.PORT || 8080);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(testRouter);
app.use(loginRouter);

app.use( (req, res, next) => {

    res.status(404).json({
        error:true,
        code:404,
        message: 'RESOURCE NOT FOUND --> ' + err.message
    })

    next();
})
app.use(errorHandling);

module.exports = app;