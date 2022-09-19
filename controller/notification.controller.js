const db = require("../database");

let notifications;

function getNotifications(req, res) {
  let id_user = req.query.id_user;
  let data = {};

  db.connect((error) => {
    if (error) {
      console.error("DB CONNECTION ERROR");
    } else {
      let sql;

      
      
      
    //! next event

      sql = "SELECT * FROM events ORDER BY date LIMIT 1";

      db.query(sql, (error, result) => {
        if (error) {
          console.error("ERROR FETCHING LAST EVENT");
        } else {
            data.nextEvent = result.pop();
            
    //! pending tasks

          sql = `SELECT * FROM users_tasks WHERE (id_user = ${id_user})`;

          db.query(sql, (error, result) => {
    
            if (error) {
              console.error("ERROR FETCHING LAST TASK");
              console.error(error.message)
            } else {
    
                let sql = `SELECT * FROM tasks WHERE (id_task = ${result.pop().id_task})`
                
                db.query(sql, (err, result) => {
                    if (err){
                        console.error(error.message)
    
                    }else{
                        data.pendingTasks = result;
                        
                        //envio la response al final (con todos los datos cargados)

                        const response = {
                          error: false,
                          code: 200,
                          data: data,
                        };
                
                        res.send(response);
                    }
                })
            }
          });
        }


      });
    }
  });
}
module.exports = { getNotifications };
