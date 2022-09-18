const app = require('./app');
const PORT = app.get('PORT');
require ("./database");


app.listen(PORT, () => {
    console.log('API Running on port: ' + PORT);
})