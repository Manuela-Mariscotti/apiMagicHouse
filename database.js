let mysql = require("mysql2");
let connection = mysql.createConnection(
    {
        // host: "magic-house.ch4fjdo70zwm.us-east-1.rds.amazonaws.com",
        host: "magic-house.ciccbj4dbsck.eu-west-3.rds.amazonaws.com",
        user: "admin",
        password: "casamagica123",
        database: "magic-house"
    }
)
connection.connect(function(error){
    error ? console.log("Error conecting DB : --> "+error) : console.log("Conexión DB correcta.");
});

module.exports = connection;