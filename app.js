const express = require('express');
const cors = require('cors');

const errorHandling = require('./error/errorHandling');

const testRouter = require('./router/test.router');
const loginRouter = require('./router/login.router');
const notificationsRouter = require('./router/notifications.router');
const spentsRouter = require('./router/spents.router');
const userdataRouter = require('./router/userdata.router');

const app = express();

app.set('PORT', process.env.PORT || 8080);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(testRouter);
app.use(loginRouter);
app.use(notificationsRouter);
app.use(spentsRouter);
app.use(userdataRouter);

app.use( (req, res, next) => {

    res.status(404).json({
        error:true,
        code:404,
        message: 'RESOURCE NOT FOUND'
    })

})
app.use(errorHandling);

module.exports = app;